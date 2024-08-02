import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface AlaUrls extends BaseURLs {
  labelValueWithHabitaciones: string;
}

export const ALA_URLS: AlaUrls = {
  create: 'alas/',
  update: (id: PK) => `alas/${id}/`,
  delete: (id: PK) => `alas/${id}/`,
  retrieve: (id: PK) => `alas/${id}/`,
  labelValueWithHabitaciones: 'alas/label-value-with-habitaciones/',
};
