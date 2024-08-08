import { BaseService } from '../base.service';
import { USUARIO_URLS, UsuarioUrls } from './usuario.url';

export class UsuarioService extends BaseService<UsuarioUrls> {
  constructor() {
    super(USUARIO_URLS);
  }

  async login(username: string, password: string) {
    return this.request('POST', this.urls.login, { username, password }, (statusCode) => statusCode === 200, true);
  }

  async perfil() {
    return this.request('POST', this.urls.perfil);
  }
}
