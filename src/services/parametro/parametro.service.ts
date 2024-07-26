import { AxiosRequestConfig } from 'axios';
import API from '../api';
import { PARAMETRO_URLS } from './parametro.urls';
import { PARAMETROS } from './parametro.enum';

/**
 * Servicio para gestionar parámetros.
 */
export class ParametroService {
  /**
   * Encuentra un parámetro por su código.
   * @param {string} codigo - Código del parámetro.
   * @param {AxiosRequestConfig} [config] - Configuración opcional de la solicitud.
   * @returns {Promise<any>} - Datos del parámetro.
   */
  static async findByCodigo(codigo: PARAMETROS, config?: AxiosRequestConfig): Promise<any> {
    return (await API.private().post(PARAMETRO_URLS.findByCodigo, { codigo }, config)).data;
  }

  /**
   * Encuentra múltiples parámetros por sus códigos.
   * @param {string[]} codigos - Códigos de los parámetros.
   * @param {AxiosRequestConfig} [config] - Configuración opcional de la solicitud.
   * @returns {Promise<any>} - Datos de los parámetros.
   */
  static async findByCodigos(codigos: PARAMETROS[], config?: AxiosRequestConfig): Promise<any> {
    return (await API.private().post(PARAMETRO_URLS.findByCodigos, { codigos }, config)).data;
  }
}
