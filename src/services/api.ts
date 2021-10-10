import CONFIGS from '@src/constants/configs';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { URL_BASE } from './urls';

const API = {
  public(configs?: AxiosRequestConfig): AxiosInstance {
    return axios.create({
      baseURL: `${URL_BASE}api/`,
      responseType: 'json',
      ...configs,
    });
  },
  private(configs?: AxiosRequestConfig): AxiosInstance {
    return this.public({
      headers: {
        Authorization: `Bearer ${localStorage.getItem(CONFIGS.TOKEN_KEY)}`,
      },
      ...configs,
    });
  },
};

export default API;
