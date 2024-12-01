import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGES_DIR, UPLOAD_VIDEOS_DIR } from '~/constants/dir'
import fs from 'fs'
import HTTP_STATUS from '~/constants/httpStatus'

class StaticController {
  servImage(req: Request, res: Response) {
    const { name } = req.params
    return res.sendFile(path.resolve(UPLOAD_IMAGES_DIR, name), (err) => {
      if (err) res.status((err as any).status).send('Ảnh không tồn tại')
    })
  }
  async servVideo(req: Request, res: Response) {
    const range = req.headers.range
    if (!range) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
    }
    const { name } = req.params
    const videoPath = path.resolve(UPLOAD_VIDEOS_DIR, name)
    // 1MB = 10^6 bytes bytes (Tính theo hệ thập phân, đây là chúng ta thấy trên UI)
    // Còn tính theo hệ nhị phân thì 1MB = 2^20 bytes (1024 * 1024)
    // Dung lượng video tính theo bytes
    const videoSize = fs.statSync(videoPath).size
    // Dung lượng video cho mỗi phân đoạn stream
    const chunkSize = 30 ** 6 // 1MB
    // Lấy giá trị byte bắt đầu từ header Range (vd: bytes=32324-)
    const start = Number(range.replace(/\D/g, ''))
    // Giá trị byte kết thúc, vượt quá giá trị dung lượng video thì lấy giá trị videoSize cuối cùng
    const end = Math.min(start + chunkSize, videoSize - 1)
    // Dung lượng thực tế cho mỗi phân đoạn stream
    // Thường đây sẽ là chunkSize, ngoại trừ phân đoạn cuối cùng
    const contentLength = end - start + 1
    const mime = (await import('mime')).default
    const contentType = mime.getType(videoPath) || 'video/*'
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': contentType
    }
    res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
  }
}

const staticController = new StaticController()

export default staticController
