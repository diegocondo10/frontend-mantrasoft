import { PK } from '@src/types/api';
import { BaseService } from '../base.service';
import { HORARIO_URLS, HorarioUrls } from './horario.urls';

export class HorarioService extends BaseService<HorarioUrls> {
  constructor() {
    super(HORARIO_URLS);
  }

  async asignar(enfermeraId: PK, jornadaId: PK, fecha: string) {
    return this.request('POST', this.urls.asignar(enfermeraId, jornadaId), { fecha });
  }
}
