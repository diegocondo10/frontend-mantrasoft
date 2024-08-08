import CONFIGS from '@src/constants/configs';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { URL_BASE } from './urls';

interface API {
  public(configs?: AxiosRequestConfig): AxiosInstance;
  private(configs?: AxiosRequestConfig): AxiosInstance;
}

const createAxiosInstance = (configs?: AxiosRequestConfig): AxiosInstance => {
  return axios.create({
    baseURL: `${URL_BASE}api/`,
    responseType: 'json',
    ...configs,
  });
};

const API: API = {
  public(configs?: AxiosRequestConfig): AxiosInstance {
    return createAxiosInstance(configs);
  },
  private(configs?: AxiosRequestConfig): AxiosInstance {
    const instance = createAxiosInstance(configs);

    instance.interceptors.request.use(
      (config) => {
        const token = Cookies.get(CONFIGS.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return instance;
  },
};

export default API;
