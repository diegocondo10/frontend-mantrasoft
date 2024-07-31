import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface HabitacionUrls extends BaseURLs {}

export const HABITACION_URLS: HabitacionUrls = {
  create: 'habitaciones/',
  update: (id: PK) => `habitaciones/${id}/`,
  delete: (id: PK) => `habitaciones/${id}/`,
  retrieve: (id: PK) => `habitaciones/${id}/`,
};
