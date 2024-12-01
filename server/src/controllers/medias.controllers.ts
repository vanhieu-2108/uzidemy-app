import { Request, Response } from 'express'
import mediasService from '~/services/medias.services'

class MediasController {
  async uploadImage(req: Request, res: Response) {
    const result = await mediasService.uploadImage(req)
    return res.json({
      message: 'Upload ảnh thành công',
      result
    })
  }
  async uploadVideo(req: Request, res: Response) {
    const result = await mediasService.uploadVideo(req)
    return res.json({
      message: 'Upload video thành công',
      result
    })
  }
}

const mediasController = new MediasController()
export default mediasController
