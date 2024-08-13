import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface SignosVitalesUrls extends BaseURLs {
  registrar: string;
  getSignosByDate: (fecha: string, idFicha: PK) => string;
  mes: (fecha: string, idFicha: PK) => string;
}

export const SIGNOS_VITALES_URLS: SignosVitalesUrls = {
  list: 'signos-vitales/',
  create: 'signos-vitales/',
  update: (id: PK) => `signos-vitales/${id}/`,
  delete: (id: PK) => `signos-vitales/${id}/`,
  retrieve: (id: PK) => `signos-vitales/${id}/`,
  registrar: 'signos-vitales/registrar/',
  getSignosByDate: (fecha: string, idFicha: PK) => `signos-vitales/by-date/${fecha}/${idFicha}/`,
  mes: (fecha: string, idFicha: PK) => `signos-vitales/mes/${fecha}/${idFicha}/`,
};
