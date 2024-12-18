import { ObjectId, WithId } from 'mongodb'
import { EPostStatus, ERole } from '~/constants/enums'
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
          status: EPostStatus.DELETED
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
  async getPosts(role: string) {
    let result
    if (role === ERole.ADMIN) {
      result = await databaseService.posts
        .aggregate([
          {
            $lookup: {
              from: 'users', // Collection cần lookup
              localField: 'user_id', // Trường trong collection posts
              foreignField: '_id', // Trường trong collection users
              as: 'user' // Kết quả lookup sẽ lưu vào trường user
            }
          },
          {
            $unwind: {
              path: '$user' // Giải nén mảng user
            }
          },
          {
            $project: {
              title: 1,
              content: 1,
              image: 1,
              author: 1,
              created_at: 1,
              status: 1,
              user: {
                avatar: 1
              }
            }
          }
        ])
        .toArray()
    } else {
      result = await databaseService.posts
        .aggregate([
          {
            $match: {
              status: EPostStatus.PUBLIC // Lọc bài viết chỉ lấy PUBLIC
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $project: {
              title: 1,
              content: 1,
              image: 1,
              author: 1,
              status: 1,
              user: {
                avatar: 1
              }
            }
          }
        ])
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
          status: EPostStatus.PUBLIC
        }
      }
    )
    return {
      message: 'Đổi trạng thái bài viết thành công'
    }
  }

  async getPostsByUserId(user_id: string) {
    const findUser = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
    if (!findUser) {
      throw new Error('Người dùng không tồn tại')
    }
    const result = await databaseService.posts
      .find({
        user_id: new ObjectId(user_id)
      })
      .toArray()
    return {
      message: 'Lấy danh sách bài viết theo người dùng thành công.',
      result
    }
  }
}

const postsService = new PostsService()
export default postsService
