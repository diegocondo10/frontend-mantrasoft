import { PK } from '@src/types/api';
import { BaseService } from '../base.service';
import { REGISTRO_MEDICACION_URLS, RegistroMedicacionUrls } from './registroMedicacion.urls';

export class RegistroMedicacionService extends BaseService<RegistroMedicacionUrls> {
  constructor() {
    super(REGISTRO_MEDICACION_URLS);
  }

  async registrar(body) {
    return this.request('POST', this.urls.registrar, body);
  }

  async registroPaciente(idPaciente: PK, fecha: string) {
    return this.request('POST', this.urls.registroPaciente(idPaciente), { fecha });
  }
}
