import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface SeguimientoUrls extends BaseURLs {}

export const SEGUIMIENTO_URLS: SeguimientoUrls = {
  list: 'seguimientos-enfermeria/',
  create: 'seguimientos-enfermeria/',
  update: (id: PK) => `seguimientos-enfermeria/${id}/`,
  delete: (id: PK) => `seguimientos-enfermeria/${id}/`,
  retrieve: (id: PK) => `seguimientos-enfermeria/${id}/`,
};
