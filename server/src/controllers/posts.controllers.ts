import { NextFunction, Request, Response } from 'express'
import { TokenPayload } from '~/model/requests/User.requests'
import Post from '~/model/schemas/Post.schema'
import postsService from '~/services/posts.services'

class PostsControllers {
  async addPost(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_access_token as TokenPayload
    const result = await postsService.addPost({ ...req.body, user_id })
    res.json(result)
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    const post_id = (req.post as any)._id.toString() as string
    const result = await postsService.updatePost(post_id, req.body)
    res.json(result)
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const post_id = (req.post as any)._id.toString() as string
    const result = await postsService.deletePost(post_id)
    res.json(result)
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    const result = await postsService.getPosts(true)
    res.json(result)
  }
  async getPost(req: Request, res: Response, next: NextFunction) {
    const post_id = req.params.post_id
    const result = await postsService.getPost(post_id)
    res.json(result)
  }

  async togglePost(req: Request, res: Response, next: NextFunction) {
    const post_id = req.params.post_id
    const result = await postsService.togglePost(post_id, req.post as Post)
    res.json(result)
  }
}

const postsControllers = new PostsControllers()
export default postsControllers
