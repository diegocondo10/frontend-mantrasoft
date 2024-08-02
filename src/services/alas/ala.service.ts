import { BaseService } from '../base.service';
import { ALA_URLS, AlaUrls } from './ala.urls';

export class AlaService extends BaseService<AlaUrls> {
  constructor() {
    super(ALA_URLS);
  }

  async labelValueWithHabitaciones(): Promise<any> {
    return this.request('GET', this.urls.labelValueWithHabitaciones);
  }
}
