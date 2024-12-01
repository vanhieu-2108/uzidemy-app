import { compare, hash } from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/model/requests/User.requests'
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    hash(password, 10, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
}
export const verifyPassword = async (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    compare(password, hash, (err, same) => {
      if (err) reject(err)
      resolve(same)
    })
  })
}
export const signToken = ({
  payload,
  privateKey,
  option
}: {
  payload: string | Buffer | object
  privateKey: string
  option: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, option, (err, token) => {
      if (err) reject(err)
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, privateKey }: { token: string; privateKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded as TokenPayload)
    })
  })
}
