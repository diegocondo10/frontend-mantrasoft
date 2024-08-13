import { PK } from '@src/types/api';
import { BaseService } from '../base.service';
import { SIGNOS_VITALES_URLS, SignosVitalesUrls } from './signosVitales.urls';

export class SignosVitalesService extends BaseService<SignosVitalesUrls> {
  constructor() {
    super(SIGNOS_VITALES_URLS);
  }

  async registrar(fecha: string, hora: string, idFicha: PK, signos: Record<string, number>) {
    return this.request('POST', this.urls.registrar, {
      fecha,
      hora,
      idFicha,
      signos,
    });
  }

  async findByDate(fecha: string, idFicha: PK) {
    return this.request('GET', this.urls.getSignosByDate(fecha, idFicha));
  }

  async mes(fecha: string, idFicha: PK) {
    return (await this.request('GET', this.urls.mes(fecha, idFicha))).data;
  }
}
