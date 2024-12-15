import { Router } from 'express'
import quizzesController from '~/controllers/quizzes.controllers'
import { createQuizValidator, deleteQuizValidator, updateQuizValidator } from '~/middlewares/quizzes.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapHandler } from '~/utils/wrapHandler'
const quizzesRouter = Router()

/**
 * Route tạo mới một bài quiz
 * [POST] /quizzes
 * body: {
 * lecture_id: string
 * user_id: string
 * questions: [
 *  {
 *   question: string
 *   correct_option_id: string
 *   options: [
 *     {
 *       correct_answer: string
 *       option_id: string
 *     }
 * ],
 * }
 * }
 */

quizzesRouter.post('', accessTokenValidator, createQuizValidator, wrapHandler(quizzesController.create))

/**
 * Route cập nhật một bài quiz
 * [PUT] /quizzes/:quiz_id
 * Param: quiz_id: string
 * body: {
 * lecture_id: string
 * questions: [
 * {
 * question: string
 * options: [
 *  {
 *   correct_answer: string
 *   option_id: string
 *  }
 * ],
 * correct_option_id: string
 * }
 * ]
 */

quizzesRouter.put('/:quiz_id', accessTokenValidator, updateQuizValidator, wrapHandler(quizzesController.update))

/**
 * Route xóa một bài quiz
 * [DELETE] /quizzes/:quiz_id
 * Param: quiz_id: string
 */

quizzesRouter.delete('/:quiz_id', accessTokenValidator, deleteQuizValidator, wrapHandler(quizzesController.delete))

/**
 * Route lấy danh sách bài quiz theo chapter
 * [GET] /quizzes/:lecture_id
 */

quizzesRouter.get('/chapter/:chapter_id', accessTokenValidator, wrapHandler(quizzesController.getAllQuizByChapterId))

/**
 * Route lấy chi tiết một bài quiz
 * [GET] /quizzes/:quiz_id
 */

quizzesRouter.get('/:quiz_id', accessTokenValidator, wrapHandler(quizzesController.getQuizById))

export default quizzesRouter
