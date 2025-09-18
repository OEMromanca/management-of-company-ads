import type { AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";

async function get<T>(url: string): Promise<T> {
  const response = await axiosInstance.get<T>(url);
  return response.data;
}

async function put<TResponse, TRequest>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axiosInstance.put<TResponse>(url, data, config);
  return response.data;
}

async function post<TResponse, TRequest>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axiosInstance.post<TResponse>(url, data, config);
  return response.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.delete<T>(url, config);
  return response.data;
}

async function patch<TResponse, TRequest = undefined>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axiosInstance.patch<TResponse>(url, data, config);
  return response.data;
}

export { get, put, post, del, patch };
