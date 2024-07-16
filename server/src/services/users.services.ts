import { ObjectId } from 'mongodb'
import { ERole } from '~/constants/enums'
import { ChangePasswordReqBody, RegisterReqBody, UpdateMeReqBody } from '~/model/requests/User.requests'
import RefreshToken from '~/model/schemas/RefreshToken.schema'
import User, { IUser } from '~/model/schemas/User.schema'
import databaseService from '~/services/database.services'
import envConfig from '~/utils/config'
import { hashPassword, signToken, verifyToken } from '~/utils/utils'
class UsersServices {
  private decodedRefreshToken(token: string) {
    return verifyToken({ token, privateKey: envConfig.refreshTokenSecret })
  }
  async register(data: RegisterReqBody) {
    const hash = await hashPassword(data.password)
    const result = await databaseService.users.insertOne(
      new User({
        ...data,
        password: hash
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
        _destroy: user._destroy
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
}
const usersServices = new UsersServices()
export default usersServices
