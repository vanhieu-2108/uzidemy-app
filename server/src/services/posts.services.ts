import { ObjectId, WithId } from 'mongodb'
import { ErrorWithStatus } from '~/model/Errors'
import { AddPostReqBody } from '~/model/requests/Post.requests'
import Post from '~/model/schemas/Post.schema'
import databaseService from '~/services/database.services'

class PostsService {
  async addPost(body: AddPostReqBody) {
    const result = await databaseService.posts.insertOne(
      new Post({
        ...body,
        user_id: new ObjectId(body.user_id)
      })
    )
    return {
      message: 'Thêm bài viết thành công',
      result
    }
  }
  async updatePost(post_id: string, body: AddPostReqBody) {
    const result = await databaseService.posts.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      {
        $set: {
          ...body,
          user_id: new ObjectId(body.user_id)
        }
      },
      { returnDocument: 'after' }
    )
    return {
      message: 'Cập nhật bài viết thành công',
      result
    }
  }
  async deletePost(post_id: string) {
    await databaseService.posts.updateOne(
      { _id: new ObjectId(post_id) },
      {
        $set: {
          _destroy: true
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: 'Xóa bài viết thành công'
    }
  }
  async getPosts(isAll: boolean = false) {
    let result
    if (isAll) {
      result = await databaseService.posts.find().toArray()
    } else {
      result = await databaseService.posts
        .find({
          _destroy: {
            $ne: true
          }
        })
        .toArray()
    }

    return {
      message: 'Lấy danh sách bài viết thành công',
      result
    }
  }

  async getPost(post_id: string) {
    const result = await databaseService.posts.findOne({ _id: new ObjectId(post_id) })
    return {
      message: 'Lấy chi tiết bài viết thành công',
      result
    }
  }
  async togglePost(post_id: string, post: Post) {
    await databaseService.posts.updateOne(
      {
        _id: new ObjectId(post_id)
      },
      {
        $set: {
          _destroy: !post._destroy
        }
      }
    )
    return {
      message: 'Đổi trạng thái bài viết thành công'
    }
  }
}

const postsService = new PostsService()
export default postsService
