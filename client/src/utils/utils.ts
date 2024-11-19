import authApiRequest from "@/apiRequests/auth";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import jwt from "jsonwebtoken";

export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken được gọi, thì nó sẽ lấy access token và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh cũ ở lần đầu gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  // Chưa đăng nhập cũng không cho chạy
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };
  // Thời điểm hết hạn của token được tính theo epoch time (s)
  // Còn khi dùng cú pháp new Date().getTime() thì nó trả về epoch time (ms) nên phải chia cho 1000 để chuyển về giây
  const now = new Date().getTime() / 1000 - 1;
  // Trường hợp rẻfresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    param?.onError && param.onError();
    return;
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // Thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của access token dựa theo công thức như sau: decodedAccessToken.exp - decodedAccessToken.iat
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // Gọi api refresh token
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res?.payload.result.access_token);
      setRefreshTokenToLocalStorage(res.payload.result.refresh_token);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};

export const formatPriceToVND = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
