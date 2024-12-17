import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGES_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import envConfig from '~/utils/config'
interface Media {
  url: string
  type: EMediaType
}
enum EMediaType {
  IMAGE,
  VIDEO
}
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameFromFullname(file.newFilename)
        const newFullFileName = `${newFileName + '1'}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGES_DIR, newFullFileName)
        sharp.cache(false)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: `${envConfig.host}/static/images/${newFullFileName}`,
          type: EMediaType.IMAGE
        }
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        return {
          url: `${envConfig.host}/static/stream-video/${file.newFilename}`,
          type: EMediaType.VIDEO
        }
      })
    )
    return result
  }
}
const mediasService = new MediasService()
export default mediasService
