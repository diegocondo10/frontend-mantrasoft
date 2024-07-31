import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface HorarioUrls extends BaseURLs {
  asignar: (enfermeraId: PK, jornadaId: PK) => string;
}

export const HORARIO_URLS: HorarioUrls = {
  create: 'horarios/',
  update: (id: PK) => `horarios/${id}/`,
  delete: (id: PK) => `horarios/${id}/`,
  retrieve: (id: PK) => `horarios/${id}/`,
  asignar: (enfermeraId: PK, jornadaId: PK) => `horarios/create-or-update/${enfermeraId}/${jornadaId}/`,
};
