import { ObjectId } from 'mongodb'

interface Faq {
  question: string
  answer: string
}

export enum ECourseStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED'
}

interface ICourse {
  _id?: ObjectId
  slug: string
  title: string
  description: string
  original_price: number
  sale_price: number
  chapters?: ObjectId[]
  image?: string
  view_count?: number
  benefits?: string[]
  requirements?: string[]
  faqs?: Faq[]
  created_at?: Date
  updated_at?: Date
  status?: ECourseStatus
}
export default class Course {
  _id?: ObjectId
  slug: string
  title: string
  description: string
  original_price: number
  sale_price: number
  chapters?: ObjectId[]
  image?: string
  view_count?: number
  benefits?: string[]
  requirements?: string[]
  faqs?: Faq[]
  created_at?: Date
  updated_at?: Date
  status?: ECourseStatus
  constructor({
    _id,
    slug,
    title,
    description,
    image,
    original_price,
    sale_price,
    chapters,
    view_count,
    created_at,
    updated_at,
    status,
    benefits,
    requirements,
    faqs
  }: ICourse) {
    const date = new Date()
    this._id = _id
    this.slug = slug
    this.title = title
    this.description = description
    this.original_price = original_price
    this.sale_price = sale_price
    this.chapters = chapters || []
    this.image = image || ''
    this.view_count = view_count || 0
    this.benefits = benefits || []
    this.requirements = requirements || []
    this.faqs = faqs || []
    this.status = status || ECourseStatus.ACTIVE
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
