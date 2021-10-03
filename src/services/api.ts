import CONFIGS from '@src/constants/configs';
import axios, { AxiosRequestConfig } from 'axios';
import { URL_BASE } from './urls';

const API = {
  public(configs?: AxiosRequestConfig) {
    return axios.create({
      url: `${URL_BASE}/api/`,
      ...configs,
    });
  },
  private(configs?: AxiosRequestConfig) {
    return this.public({
      headers: {
        Authorization: `Bearer ${localStorage.getItem(CONFIGS.TOKEN_KEY)}`,
      },
      ...configs,
    });
  },
};

export default API;
