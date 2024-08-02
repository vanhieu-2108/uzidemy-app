import { IconBlog, IconBook, IconPlay, IconProfile } from "@/components/icons";

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
  // {
  //   url: "/manage/member",
  //   title: "Quản lý thành viên",
  //   isAdmin: true,
  // },
  // {
  //   url: "/manage/order",
  //   title: "Quản lý đơn hàng",
  // },
  // {
  //   url: "/manage/comment",
  //   title: "Quản lý bình luận",
  // },
];
