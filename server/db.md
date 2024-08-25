# Database Schema

## Users

```ts
_id: string
email: string
username: string
password: string
courses: string[]
role: string
created_at: Date
updated_at: Date
forgot_password_token: string
email_verify_token: string
_destroy: boolean // Thay vì xóa user thì đánh dấu _destroy = true để không ảnh hưởng đến dữ liệu tương tự như các bảng khác
```

## RefreshTokens

```ts
_id: string
user_id: string
token: string
created_at: Date
iat: Date
exp: Date
```

## Courses

```ts
_id: ObjectId
slug: string
title: string
description: string
author: string
image: string
original_price: number
sale_price: number
view_count: number
created_at: Date
updated_at: Date
_destroy: boolean
chapters: ObjectId[]
benefits: string[]
requirements: string[]
faq: ObjectId[]
```

## FAQ

```ts
question: string
answer: string
```

## Chapters

```ts
_id: ObjectId
title: string
course_id: ObjectId
lectures: ObjectId[]
created_at: Date
updated_at: Date
_destroy: boolean
```

## Lectures

```ts
_id: ObjectId
slug: string
title: string
video_url: string
content: string
chapter_id: ObjectId
course_id: ObjectId
quiz_id: ObjectId
created_at: Date
updated_at: Date
_destroy: boolean
```

## Quizzes

```ts
_id: ObjectId
lecture_id: ObjectId
questions: [
  {
    question: string
    options: [
      {
        answer: string
        is_correct: boolean
      }
    ]
  }
]
created_at: Date
updated_at: Date
```

## Orders

```ts
_id: ObjectId
order_id: number
user_id: ObjectId
course_id: ObjectId
price: number
status: 'SUCCESS' | 'PENDING' | 'FAILED'
created_at: Date
updated_at: Date
_destroy: boolean
```

## Comments

```ts
_id: ObjectId
user_id: ObjectId
parent_id: ObjectId | null
object_id: ObjectId
object_type: 'LECTURE' | 'POST'
content: string
_destroy: boolean
created_at: Date
updated_at: Date
```

## Notifications

```ts
_id: ObjectId
user_id: ObjectId | null // Nếu null thì là notification cho tất cả user
content: string
created_at: Date
read: boolean
```

## Histories

```ts
_id: ObjectId
user_id: ObjectId
course_id: ObjectId
lesson_id: ObjectId
created_at: Date
```
