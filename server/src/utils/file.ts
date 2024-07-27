import { Request } from 'express'
import formidable, { File } from 'formidable'
import path from 'path'
import fs from 'fs'
import { UPLOAD_IMAGES_DIR, UPLOAD_VIDEOS_DIR } from '~/constants/dir'
export const initFolder = () => {
  ;[UPLOAD_IMAGES_DIR, UPLOAD_VIDEOS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }) // recursive: true để tạo thư mục nested
    }
  })
}

export const handleUploadImage = (req: Request) => {
  const form = formidable({
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024, // 2MB,
    uploadDir: path.resolve(UPLOAD_IMAGES_DIR),
    filter: ({ name, originalFilename, mimetype }) => {
      const isValid = Boolean(name === 'image' && mimetype?.includes('image/'))
      if (!isValid) {
        form.emit('error' as any, new Error('File gửi lên không hợp lệ') as any)
      }
      return isValid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File gửi lên trống hoặc không hợp lệ'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024, // 200MB,
    uploadDir: path.resolve(UPLOAD_VIDEOS_DIR),
    filter: ({ name, originalFilename, mimetype }) => {
      const isValid = Boolean(name === 'video' && mimetype?.includes('mp4'))
      if (!isValid) {
        form.emit('error' as any, new Error('File gửi lên không hợp lệ') as any)
      }
      return isValid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File gửi lên trống hoặc không hợp lệ'))
      }
      resolve(files.video as File[])
    })
  })
}
export const getNameFromFullname = (fullname: string) => {
  return fullname.split('.')[0]
}

export const getExtension = (fullname: string) => {
  const name = fullname.split('.')
  return name[name.length - 1]
}
