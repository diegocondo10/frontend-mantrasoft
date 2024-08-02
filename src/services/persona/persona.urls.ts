import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface PersonaUrls extends BaseURLs {
  labelValue: string;
}

export const PERSONA_URLS: PersonaUrls = {
  create: 'personas/',
  update: (id: PK) => `personas/${id}/`,
  delete: (id: PK) => `personas/${id}/`,
  retrieve: (id: PK) => `personas/${id}/`,
  labelValue: 'personas/label-value/',
};
