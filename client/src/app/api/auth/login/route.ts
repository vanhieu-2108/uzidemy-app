import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import { EntityError } from "@/lib/http";

export async function POST(req: Request) {
  const body = await req.json();
  const cookieStore = cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { access_token, refresh_token } = payload.result;
    const decodedAccessToken = jwt.decode(access_token) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(refresh_token) as {
      exp: number;
    };
    // Chuyển đổi exp thành Date object
    const accessTokenExpiryDate = new Date(decodedAccessToken.exp * 1000);
    const refreshTokenExpiryDate = new Date(decodedRefreshToken.exp * 1000);
    // Thiết lập cookie với đúng định dạng
    cookieStore.set("accessToken", access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: accessTokenExpiryDate,
    });
    cookieStore.set("refreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: refreshTokenExpiryDate,
    });

    return Response.json(payload);
  } catch (error) {
    if (error instanceof EntityError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    }
    return Response.json(error, {
      status: 400,
    });
  }
}
