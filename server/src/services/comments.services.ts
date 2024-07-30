import { ObjectId } from 'mongodb'
import { CreateComentReqBody, UpdateCommentReqBody } from '~/model/requests/Comment.requests'
import Comment from '~/model/schemas/Comment.schema'
import databaseService from '~/services/database.services'

class CommentsService {
  async create(user_id: string, body: CreateComentReqBody) {
    await databaseService.comments.insertOne(
      new Comment({
        ...body,
        user_id: new ObjectId(user_id),
        object_id: new ObjectId(body.object_id),
        parent_id: body.parent_id ? new ObjectId(body.parent_id) : null
      })
    )
    return {
      message: 'Tạo comment thành công'
    }
  }
  async update(comment_id: string, body: UpdateCommentReqBody) {
    const result = await databaseService.comments.findOneAndUpdate(
      {
        _id: new ObjectId(comment_id)
      },
      {
        $set: {
          ...body,
          parent_id: body.parent_id ? new ObjectId(body.parent_id) : null,
          object_id: new ObjectId(body.object_id)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: 'Cập nhật comment thành công',
      result
    }
  }
  async delete(comment_id: string) {
    await databaseService.comments.updateMany(
      {
        _id: new ObjectId(comment_id)
      },
      {
        $set: {
          _destroy: true
        }
      }
    )
    return {
      message: 'Xóa comment thành công'
    }
  }
  async getCommentsByObjectId(object_id: string) {
    const result = await databaseService.comments
      .find({
        object_id: new ObjectId(object_id)
      })
      .toArray()
    return {
      message: 'Lấy danh sách comment thành công',
      result
    }
  }
}

const commentsService = new CommentsService()
export default commentsService
