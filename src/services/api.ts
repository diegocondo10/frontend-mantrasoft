import CONFIGS from '@src/constants/configs';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { URL_BASE } from './urls';

interface API {
  public(configs?: AxiosRequestConfig): AxiosInstance;
  private(configs?: AxiosRequestConfig): AxiosInstance;
  getReporte(url: string): (evt: any) => Promise<void>;
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
    const token = typeof window !== 'undefined' ? localStorage.getItem(CONFIGS.TOKEN_KEY) : null;
    return createAxiosInstance({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...configs,
    });
  },
  getReporte(url: string) {
    return async (evt: Event) => {
      const target = evt?.target as HTMLButtonElement | null;

      if (target) {
        const parentElement = target.parentElement as HTMLButtonElement | null;
        if (parentElement) {
          parentElement.disabled = true;
          parentElement.classList.add('test');
        }
        target.disabled = true;
        target.classList.add('test');
      }

      try {
        const res = await this.private({ responseType: 'blob' }).get(url);
        const objUrl = window.URL.createObjectURL(res.data);
        window.open(objUrl);
      } catch (error) {
        console.error('Error generating report:', error);
        alert('Ha ocurrido un problema al generar el reporte');
      }

      setTimeout(() => {
        if (target) {
          const parentElement = target.parentElement as HTMLButtonElement | null;
          if (parentElement) {
            parentElement.disabled = false;
            parentElement.classList.remove('test');
          }
          target.disabled = false;
          target.classList.remove('test');
        }
      }, 100);
    };
  },
};

export default API;
