import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from "@/lib/utils";
import { redirect } from "next/navigation";
const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;
type CusTomOptions = Omit<RequestInit, "method"> & {
  baseURL?: string | undefined;
};

type EntityErrorPayload = {
  message: string;
  errors: {
    [key: string]: {
      path: string;
      msg: string;
    };
  };
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload, message = "Lỗi HTTP" }: { status: number; payload: any; message?: string }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: "Lỗi thực thể" });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
const isClient = typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CusTomOptions | undefined
) => {
  let body: FormData | undefined | string = undefined;
  // Kiểm tra nêú body là FormData thì không cần chuyển đổi
  // Ngược lại thì chuyển đổi sang JSON
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } = options?.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage();
    baseHeaders.Authorization = `Bearer ${accessToken}`;
  }
  // Nếu không truyền baseURL (hoặc baseURL === undefined) thì sẽ lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
  const baseURL = options?.baseURL === undefined ? "http://localhost:4000" : options.baseURL;
  const fullURL = `${baseURL}${url}`;
  const res = await fetch(fullURL, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: typeof ENTITY_ERROR_STATUS;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        clientLogoutRequest = fetch("/api/auth/logout", {
          method: "POST",
          body: null,
          headers: {
            ...baseHeaders,
          },
        });
        try {
          await clientLogoutRequest;
        } catch (error) {
        } finally {
          removeTokensFromLocalStorage();
          clientLogoutRequest = null;
          // Redirect về trang login có thể dẫn đến loop vô hạn
          // Nếu không không được xử lý đúng cách
          // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
          // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
          location.href = "/login";
        }
      } else {
        // Đây là trường hợp chúng ta vẫn còn accessToken (còn hạn)
        // Và chúng ta gọi api ở Next.js Server (Route Handler, Server Component đến Server Backend)
        const accessToken = (options?.headers as any)?.Authorization?.split(" ")[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở client
  //   if (isClient) {
  //     const nomarlizeUrl = normalizePath(url);
  //     if (nomarlizeUrl === "api/auth/login") {
  //       const { accessToken, refreshToken } = payload.data as any;
  //       setAccessTokenToLocalStorage(accessToken);
  //       setRefreshTokenToLocalStorage(refreshToken);
  //     } else if (nomarlizeUrl === "api/auth/logout") {
  //       removeTokensFromLocalStorage();
  //     }
  //   }
  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CusTomOptions, "body"> | undefined) {
    return request<Response>("GET", url, options);
  },
  post<Response>(url: string, body: any, options?: Omit<CusTomOptions, "body"> | undefined) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: Omit<CusTomOptions, "body"> | undefined) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(url: string, options?: Omit<CusTomOptions, "body"> | undefined) {
    return request<Response>("DELETE", url, options);
  },
};

export default http;
