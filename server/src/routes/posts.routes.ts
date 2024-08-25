import { Router } from 'express'
import postsControllers from '~/controllers/posts.controllers'
import {
  addPostValidator,
  deletePostValidator,
  getPostValidator,
  updatePostValidator
} from '~/middlewares/posts.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/wrapHandler'

const postsRouter = Router()

/**
 * [POST] Thêm bài viết mới
 * /posts
 * body: {
 *  title: string,
 *  content: string,
 *  author: string
 *  image: string
 * }
 */

postsRouter.post('', accessTokenValidator, addPostValidator, wrapHandler(postsControllers.addPost))

/**
 * [PUT] Cập nhật bài viết
 * /posts/:post_id
 * body: {
 * title: string,
 * content: string,
 * author: string
 * image: string
 * }
 */

postsRouter.put('/:post_id', accessTokenValidator, updatePostValidator, wrapHandler(postsControllers.updatePost))

/**
 * [DELETE] Xóa bài viết
 * /posts/:post_id
 */

postsRouter.delete('/:post_id', accessTokenValidator, deletePostValidator, wrapHandler(postsControllers.deletePost))

/**
 * [GET] Lấy danh sách bài viết
 * /posts
 */

postsRouter.get('', wrapHandler(postsControllers.getPosts))

/**
 * [GET] Lấy chi tiết bài viết
 * /posts/:post_id
 */

postsRouter.get('/:post_id', getPostValidator, wrapHandler(postsControllers.getPost))

/**
 * [PUT] Đổi trạng thái bài viết
 * /posts/:post_id/toggle
 */

postsRouter.put('/:post_id/toggle', accessTokenValidator, getPostValidator, wrapHandler(postsControllers.togglePost))

export default postsRouter
