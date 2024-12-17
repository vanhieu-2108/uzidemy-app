"use client";
import { IconPen, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteUserById, useGetUsers } from "@/queries/useAccount";
import { EStatusUser } from "@/types/auth";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";

export default function UserList() {
  const { data, refetch } = useGetUsers();
  const users = data?.payload.result;
  const deleteUserMutation = useDeleteUserById();
  function handleDeleleUser(id: string) {
    deleteUserMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Xóa người dùng thành công");
        refetch();
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Họ và tên</TableHead>
          <TableHead>Avatar</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Hành Động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users &&
          users.length > 0 &&
          users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.fullname}</TableCell>
              <TableCell>
                <Image
                  alt=""
                  src={Boolean(user.avatar) ? user.avatar : "https://github.com/shadcn.png"}
                  width={100}
                  height={100}
                  className="rounded-sm"
                />
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.status === EStatusUser.ACTIVE ? (
                  <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-200 rounded-full">
                    {EStatusUser.ACTIVE}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-200 rounded-full">DELEDTED</span>
                )}
              </TableCell>
              <TableCell>{user.created_at}</TableCell>
              <TableCell className="flex gap-5">
                <Link href={`/manage/users/edit/${user._id}`}>
                  <Button>
                    <IconPen />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <IconTrash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Bạn có chắc chắn muốn xóa người dùng <span className="font-semibold">{user.fullname}</span>?
                      </AlertDialogTitle>
                      <AlertDialogDescription>Xóa nhưng bạn có thể khôi phục lại người dùng này</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleleUser(user._id)}>Tiếp tục</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
