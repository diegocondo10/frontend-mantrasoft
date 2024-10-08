import { PK } from '@src/types/api';
import { BaseURLs } from '../service.types';

export interface UsuarioUrls extends BaseURLs {
  login: string;
  perfil: string;
  setPassword: (id: PK) => string;
}

export const USUARIO_URLS: UsuarioUrls = {
  create: 'usuarios/',
  update: (id: PK) => `usuarios/${id}/`,
  delete: (id: PK) => `usuarios/${id}/`,
  retrieve: (id: PK) => `usuarios/${id}/`,
  login: `usuarios/login/`,
  perfil: 'usuarios/perfil/',
  setPassword: (id: PK) => `usuarios/${id}/set-password/`,
};
