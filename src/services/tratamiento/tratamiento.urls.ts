import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface TratamientoUrls extends BaseURLs {}

export const TRATAMIE_URLS: TratamientoUrls = {
  create: 'tratamientos/',
  update: (id: PK) => `tratamientos/${id}/`,
  delete: (id: PK) => `tratamientos/${id}/`,
  retrieve: (id: PK) => `tratamientos/${id}/`,
};
