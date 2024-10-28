import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  try {
    const body = (await req.json()) as { refresh_token: string };
    const { refresh_token } = body;
    if (!refresh_token) {
      return Response.json({ message: "refresh_token is required" }, { status: 400 });
    }

    const response = await authApiRequest.sLogout({ refresh_token });
    if (response.status === 200) {
      cookieStore.delete("refreshToken");
      cookieStore.delete("accessToken");
      return Response.json(response.payload);
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    }
    return Response.json(error, {
      status: 400,
    });
  }
}
