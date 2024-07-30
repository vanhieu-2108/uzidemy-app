import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import envConfig from '~/utils/config'
import fs from 'fs'
import path from 'path'
const sesClient = new SESClient({
  region: envConfig.aws_region as string,
  credentials: {
    secretAccessKey: envConfig.aws_secret_access_key as string,
    accessKeyId: envConfig.aws_access_key_id as string
  }
})
const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf8')

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string[] | string
  body: string
  subject: string
  replyToAddresses?: string[] | string
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: envConfig.ses_from_address as string,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}

export const sendEmailVerfiy = (toAddress: string, email_verify_token: string) => {
  return sendVerifyEmail(
    toAddress,
    'Please verify your email',
    verifyEmailTemplate
      .replace('{{title}}', 'Please verify your email')
      .replace('{{content}}', 'Click the button below to verify your email.')
      .replace('{{titleLink}}', 'Verify')
      .replace('{{link}}', `http://localhost:3000/verify-email?token=${email_verify_token}`)
  )
}

export const sendForgotPassword = (toAddress: string, forgot_password_token: string) => {
  return sendVerifyEmail(
    toAddress,
    'Reset your password',
    verifyEmailTemplate
      .replace('{{title}}', 'Reset your password')
      .replace('{{content}}', 'Click the button below to reset your password.')
      .replace('{{titleLink}}', 'Reset Password')
      .replace('{{link}}', `http://localhost:3000/reset-password?token=${forgot_password_token}`)
  )
}
