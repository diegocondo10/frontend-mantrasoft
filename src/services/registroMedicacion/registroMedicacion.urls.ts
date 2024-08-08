import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface RegistroMedicacionUrls extends BaseURLs {
  registrar: string;
  registroPaciente: (idPaciente: PK) => string;
}

export const REGISTRO_MEDICACION_URLS: RegistroMedicacionUrls = {
  create: 'registro-medicacion/',
  update: (id: PK) => `registro-medicacion/${id}/`,
  delete: (id: PK) => `registro-medicacion/${id}/`,
  retrieve: (id: PK) => `registro-medicacion/${id}/`,
  registrar: 'registro-medicacion/registrar/',
  registroPaciente: (idPaciente: PK) => `registro-medicacion/paciente/${idPaciente}/`,
};
