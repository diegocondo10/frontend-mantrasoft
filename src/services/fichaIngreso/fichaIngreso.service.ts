import { PK } from '@src/types/api';
import { BaseService } from '../base.service';
import { FICHA_INGRESO_URLS, FichaIngresoUrls } from './fichaIngreso.urls';

export class FichaIngresoService extends BaseService<FichaIngresoUrls> {
  constructor() {
    super(FICHA_INGRESO_URLS);
  }

  async resumenFichaPaciente(id: PK) {
    return this.request('GET', this.urls.resumenFichaPaciente(id));
  }
}
