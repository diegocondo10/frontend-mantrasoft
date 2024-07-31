import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface FichaIngresoUrls extends BaseURLs {
  resumenFichaPaciente: (id: PK) => string;
  listByPaciente: (idPaciente: string) => string;
}

export const FICHA_INGRESO_URLS: FichaIngresoUrls = {
  create: 'fichas-ingreso/',
  update: (id: PK) => `fichas-ingreso/${id}/`,
  delete: (id: PK) => `fichas-ingreso/${id}/`,
  retrieve: (id: PK) => `fichas-ingreso/${id}/`,
  resumenFichaPaciente: (id: PK) => `fichas-ingreso/${id}/resumen-ficha-paciente/`,
  listByPaciente: (idPaciente: string) => `tratamientos/?paciente=${idPaciente}`,
};
