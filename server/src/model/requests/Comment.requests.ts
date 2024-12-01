import { EObjectTypeComment } from '~/constants/enums'

export interface CreateComentReqBody {
  parent_id: string
  object_id: string
  object_type: EObjectTypeComment
  content: string
}

export interface UpdateCommentReqBody extends CreateComentReqBody {}
