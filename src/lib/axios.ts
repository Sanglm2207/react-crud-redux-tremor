import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders
} from "axios";
import { Store } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "../store"; // Chỉ import Type
import { refreshAccessToken } from "../store/auth/actions";
import { logout } from "../store/auth/reducers";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

type AppStore = Store<RootState> & {
  dispatch: AppDispatch;
};

export const setupAxiosInterceptors = (store: AppStore) => {
  // Request Interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const state = store.getState();
      const token = state.auth.accessToken;

      if (token) {
        // Đảm bảo headers tồn tại trước khi gán
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response Interceptor
  interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Gọi action refresh token
          // store.dispatch trả về kết quả của Thunk
          const resultAction = await store.dispatch(refreshAccessToken());

          if (refreshAccessToken.fulfilled.match(resultAction)) {
            const newToken = resultAction.payload;

            // Cập nhật token cho request bị lỗi
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            
            // Gọi lại request
            return api(originalRequest);
          } else {
            // Refresh thất bại
            store.dispatch(logout());
            return Promise.reject(error);
          }
        } catch (refreshError) {
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;