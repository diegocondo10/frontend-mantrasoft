import { BaseService } from '../base.service';
import { TRATAMIE_URLS, TratamientoUrls } from './tratamiento.urls';

export class TratamientoService extends BaseService<TratamientoUrls> {
  constructor() {
    super(TRATAMIE_URLS);
  }
}
