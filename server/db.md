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
benefits: string[]
requirements: string[]
faq: ObjectId[]
```

## FAQ

```ts
_id: ObjectId
course_id: ObjectId
question: string
answer: string
created_at: Date
updated_at: Date
```

## Lectures

```ts
_id: ObjectId
title: string
course_id: ObjectId
lessons: string[]
created_at: Date
updated_at: Date
_destroy: boolean
```

## Lessons

```ts
_id: ObjectId
title: string
video_url: string
content: string
lecture_id: ObjectId
course_id: ObjectId
created_at: Date
updated_at: Date
_destroy: boolean
```

## Orders

```ts
_id: ObjectId
user_id: ObjectId
course_id: ObjectId
price: number
status: string
created_at: Date
_destroy: boolean
```

## Comments

```ts
_id: ObjectId
user_id: ObjectId
course_id: ObjectId
content: string
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

## Coupons

```ts
_id: ObjectId
code: string // Mã coupon này phải là duy nhất
discount: number
valid_from: Date
valid_until: Date
user_id: null | ObjectId // Nếu null thì là coupon cho tất cả user còn không thì là coupon cho user đó
created_at: Date
updated_at: Date
```
