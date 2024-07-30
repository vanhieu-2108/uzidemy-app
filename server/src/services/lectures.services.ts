import { ObjectId, WithId } from 'mongodb'
import { CreateLectureReqBody } from '~/model/requests/Lesson.requests'
import Lecture from '~/model/schemas/Lecture.schema'
import databaseService from '~/services/database.services'

class LecturesService {
  async create(data: CreateLectureReqBody) {
    const mongoId = new ObjectId()
    const findLastLecture = await databaseService.lectures.findOne({}, { sort: { created_at: -1 } })
    if (findLastLecture) {
      await databaseService.lectures.updateOne(
        {
          _id: new ObjectId(findLastLecture._id)
        },
        {
          $set: {
            next_lecture_id: mongoId
          }
        }
      )
    }
    await Promise.all([
      databaseService.lectures.insertOne(
        new Lecture({
          ...data,
          course_id: new ObjectId(data.course_id),
          chapter_id: new ObjectId(data.chapter_id) as any,
          _id: mongoId,
          next_lecture_id: null,
          prev_lecture_id: findLastLecture ? new ObjectId(findLastLecture._id) : null
        })
      ),
      databaseService.chapters.updateOne(
        {
          _id: new ObjectId(data.chapter_id)
        },
        {
          $push: {
            lectures: mongoId
          }
        }
      )
    ])
    return {
      message: 'Tạo bài học thành công'
    }
  }
  async update(lecture_id: string, data: CreateLectureReqBody) {
    const result = await databaseService.lectures.findOneAndUpdate(
      {
        _id: new ObjectId(lecture_id)
      },
      {
        $set: {
          ...data,
          course_id: new ObjectId(data.course_id),
          chapter_id: new ObjectId(data.chapter_id)
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      message: 'Cập nhật bài học thành công',
      result
    }
  }
  async delete(lecture_id: string) {
    await databaseService.lectures.updateOne(
      {
        _id: new ObjectId(lecture_id)
      },
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
      message: 'Xóa bài học thành công'
    }
  }
  async changeStatus(lecture_id: string) {
    const lecture = (await databaseService.lectures.findOne({ _id: new ObjectId(lecture_id) })) as WithId<Lecture>
    if (lecture._destroy) {
      await databaseService.lectures.updateOne(
        {
          _id: new ObjectId(lecture_id)
        },
        {
          $set: {
            _destroy: false
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    } else {
      await databaseService.lectures.updateOne(
        {
          _id: new ObjectId(lecture_id)
        },
        {
          $set: {
            _destroy: true
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    }
    return {
      message: 'Thay đổi trạng thái bài học thành công'
    }
  }
}

const lecturesService = new LecturesService()
export default lecturesService
