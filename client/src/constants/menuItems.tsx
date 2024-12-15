import { IconBlog, IconBook, IconBookNote, IconBox, IconPlay, IconProfile } from "@/components/icons";
export const menuItems = [
  {
    url: "/",
    title: "Khám phá",
    icon: <IconPlay className="size-5" />,
    isPublic: true,
  },
  {
    url: "/study",
    title: "Khu vực học tập",
    icon: <IconBook className="size-5" />,
    isPublic: false,
  },
  {
    url: "/profile",
    title: "Profile",
    icon: <IconProfile className="size-5" />,
    isPublic: false,
  },
  {
    url: "/blog",
    title: "Bài viết",
    icon: <IconBlog className="size-5" />,
    isPublic: true,
  },
  {
    url: "/manage/courses",
    title: "Quản lý khóa học",
    isPublic: false,
    icon: <IconBookNote className="size-5" />,
    isAdmin: true,
  },
];
