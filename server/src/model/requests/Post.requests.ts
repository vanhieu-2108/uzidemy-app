import { EPostStatus } from '~/constants/enums'

export interface AddPostReqBody {
  title: string
  content: string
  author: string
  image: string
  user_id: string
}
