import { BaseService } from '../base.service';
import { MEDICAMENTO_URLS, MedicamentoUrls } from './medicamento.urls';

export class MedicamentoService extends BaseService<MedicamentoUrls> {
  constructor() {
    super(MEDICAMENTO_URLS);
  }
}
