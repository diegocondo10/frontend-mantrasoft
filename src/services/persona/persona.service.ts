import { AxiosResponse } from 'axios';
import { BaseService } from '../base.service';
import { PERSONA_URLS, PersonaUrls } from './persona.urls';

export class PersonaService extends BaseService<PersonaUrls> {
  constructor() {
    super(PERSONA_URLS);
  }
  async labelValue(): Promise<AxiosResponse<any[]>> {
    return this.request('GET', this.urls.labelValue);
  }
}
