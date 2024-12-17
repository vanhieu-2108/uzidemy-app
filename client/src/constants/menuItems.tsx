import { IconBlog, IconBook, IconBookNote, IconBox, IconPlay, IconProfile } from "@/components/icons";
import IconUser from "@/components/icons/icon-user";
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
  {
    url: "/manage/users",
    title: "Quản lý người dùng",
    isPublic: false,
    icon: <IconUser className="size-5" />,
    isAdmin: true,
  },
];
