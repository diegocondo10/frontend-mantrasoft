import { BaseService } from '../base.service';
import { SEGUIMIENTO_URLS, SeguimientoUrls } from './seguimiento.urls';

export class SeguimientoService extends BaseService<SeguimientoUrls> {
  constructor() {
    super(SEGUIMIENTO_URLS);
  }
}
