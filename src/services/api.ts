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
  getReporte(url: string) {
    return async (evt) => {
      if (evt?.target) {
        const target = evt.target;
        target.parentElement.disabled = true;
        target.disabled = true;
        target.parentElement.classList.add('test');
        target.classList.add('test');
      }
      try {
        const res = await API.private({ responseType: 'blob' }).get(url);
        const objUrl = window.URL.createObjectURL(res.data);
        window.open(objUrl);
      } catch (error) {
        alert('Ha ocurrido un problema al generar el reporte');
      }
      setTimeout(() => {
        if (evt?.target) {
          const target = evt.target;
          target.parentElement.disabled = false;
          target.disabled = false;
          target.parentElement.classList.remove('test');
          target.classList.remove('test');
        }
      }, 100);
    };
  },
};

export default API;
