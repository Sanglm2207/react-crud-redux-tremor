import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return axiosError.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};