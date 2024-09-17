import { ObjectId } from 'mongodb'
import { ERole } from '~/constants/enums'
import { ErrorWithStatus } from '~/model/Errors'
import { ChangePasswordReqBody, RegisterReqBody, UpdateMeReqBody } from '~/model/requests/User.requests'
import RefreshToken from '~/model/schemas/RefreshToken.schema'
import User, { EVerifyUser, IUser } from '~/model/schemas/User.schema'
import databaseService from '~/services/database.services'
import envConfig from '~/utils/config'
import { sendEmailVerfiy, sendForgotPassword } from '~/utils/send-email'
import { hashPassword, signToken, verifyToken } from '~/utils/utils'
class UsersServices {
  private decodedRefreshToken(token: string) {
    return verifyToken({ token, privateKey: envConfig.refreshTokenSecret })
  }
  async register(data: RegisterReqBody) {
    const user_id = new ObjectId()
    const hash = await hashPassword(data.password)
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString(), EVerifyUser.UNVERIFY)
    const result = await databaseService.users.insertOne(
      new User({
        ...data,
        password: hash,
        _id: user_id,
        email_verify_token
      })
    )
    return result
  }
  async login(user: IUser) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user._id?.toString() as string, user.role as ERole),
      this.signRefreshToken(user._id?.toString() as string, user.role as ERole)
    ])
    const { iat, exp } = await this.decodedRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user._id),
        token: refresh_token,
        iat,
        exp
      })
    )
    return {
      access_token,
      refresh_token,
      account: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        verify: user.verify
      }
    }
  }
  async logout(user_id: string) {
    return databaseService.refreshTokens.deleteMany({ user_id: new ObjectId(user_id) })
  }
  async updateMe(user_id: string, data: UpdateMeReqBody) {
    const result = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          fullname: data.fullname,
          avatar: data.avatar
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0
        },
        returnDocument: 'after'
      }
    )
    return result
  }
  async findUserByEmail(email: string) {
    const user = await databaseService.users.findOne({ email })
    return user
  }
  async getUserById(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0
        }
      }
    )
    return user
  }
  async getAllUsers() {
    const users = await databaseService.users.find().project({ password: 0, email_verify_token: 0 }).toArray()
    return users
  }
  signAccessToken(user_id: string, role: ERole): Promise<string> {
    return signToken({
      payload: { user_id, role },
      privateKey: envConfig.accessTokenSecret,
      option: {
        expiresIn: envConfig.accessTokenExpiresIn
      }
    })
  }
  async changePassword(user_id: string, data: Omit<ChangePasswordReqBody, 'old_password'>) {
    const hash = await hashPassword(data.new_password)
    return databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hash
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
  signRefreshToken(user_id: string, role: ERole, exp?: number): Promise<string> {
    if (exp) {
      return signToken({
        payload: { user_id, role, exp },
        privateKey: envConfig.refreshTokenSecret,
        option: {}
      })
    }
    return signToken({
      payload: { user_id, role },
      privateKey: envConfig.refreshTokenSecret,
      option: {
        expiresIn: envConfig.refreshTokenExpiresIn
      }
    })
  }
  signEmailVerifyToken(user_id: string, verify: EVerifyUser) {
    return signToken({
      payload: { user_id, verify },
      privateKey: envConfig.emailSecret,
      option: {
        expiresIn: envConfig.emailExpiresIn
      }
    })
  }

  signForgotPasswordToken(user_id: string, role: ERole, verify: EVerifyUser) {
    return signToken({
      payload: { user_id, role, verify },
      privateKey: envConfig.forgotPasswordSecret,
      option: {
        expiresIn: envConfig.forgotPasswordExpiresIn
      }
    })
  }

  async refreshToken(user_id: string, refresh_token: string, exp: number) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken(user_id, ERole.USER),
      this.signRefreshToken(user_id, ERole.USER, exp),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const { iat } = await this.decodedRefreshToken(new_refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: new_refresh_token,
        user_id: new ObjectId(user_id),
        iat,
        exp
      })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }
  async verifyEmail(user_id: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          verify: EVerifyUser.VERIFIED,
          email_verify_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id, ERole.USER),
      this.signRefreshToken(user_id, ERole.USER)
    ])
    return {
      message: 'Xác thực email thành công',
      result: {
        access_token,
        refresh_token
      }
    }
  }
  async resendVerifyEmail(user_id: string, email: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id, EVerifyUser.UNVERIFY)
    await sendEmailVerfiy(email, email_verify_token)
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: 'Gửi lại email xác thực thành công'
    }
  }
  async forgotPassword({ _id, verify, role, email }: { _id: string; verify: EVerifyUser; role: ERole; email: string }) {
    const email_verify_token = await this.signForgotPasswordToken(_id, role, verify)
    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: new ObjectId(_id)
        },
        {
          $set: {
            forgot_password_token: email_verify_token
          }
        }
      ),
      sendForgotPassword(email, email_verify_token)
    ])
    return {
      message: 'Gửi email đặt lại mật khẩu thành công'
    }
  }
  async resetPassword(user_id: string, new_password: string) {
    const hash = await hashPassword(new_password)
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hash,
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: 'Đặt lại mật khẩu thành công'
    }
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại',
        status: 404
      })
    }
    return user
  }
}
const usersServices = new UsersServices()
export default usersServices
