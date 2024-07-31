import { BaseService } from '../base.service';
import { HABITACION_URLS, HabitacionUrls } from './habitacion.urls';

export class HabitacionService extends BaseService<HabitacionUrls> {
  constructor() {
    super(HABITACION_URLS);
  }
}
