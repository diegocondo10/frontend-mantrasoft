import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface FichaIngresoUrls extends BaseURLs {}

export const FICHA_INGRESO_URLS: FichaIngresoUrls = {
  create: 'fichas-ingreso/',
  update: (id: PK) => `fichas-ingreso/${id}/`,
  delete: (id: PK) => `fichas-ingreso/${id}/`,
  retrieve: (id: PK) => `fichas-ingreso/${id}/`,
};
