import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface MedicamentoUrls extends BaseURLs {
  labelValue: string;
}

export const MEDICAMENTO_URLS: MedicamentoUrls = {
  create: 'medicamentos/',
  update: (id: PK) => `medicamentos/${id}/`,
  delete: (id: PK) => `medicamentos/${id}/`,
  retrieve: (id: PK) => `medicamentos/${id}/`,
  labelValue: 'medicamentos/label-value/',
};
