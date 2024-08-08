import CONFIGS from '@src/constants/configs';
import { Perfil } from '@src/types/usuario';
import { createHook, createStore, defaults } from 'react-sweet-state';

defaults.devtools = true;

export type ProfileProps = {
  usuario?: Perfil;
};

export const initialState = {
  usuario: null,
};

const actions = {
  setUsuario:
    (usuario: Perfil) =>
    ({ setState }) => {
      localStorage.setItem(CONFIGS.USER_KEY, JSON.stringify(usuario));
      setState({ usuario });
    },
  logOut:
    () =>
    ({ setState }) => {
      localStorage.removeItem(CONFIGS.TOKEN_KEY);
      localStorage.removeItem(CONFIGS.REFRESH_TOKEN_KEY);
      localStorage.removeItem(CONFIGS.USER_KEY);
      setState({ usuario: null });
    },
  hydrate:
    () =>
    ({ setState }) => {
      const usuario = localStorage.getItem(CONFIGS.USER_KEY);
      if (usuario) {
        setState({ usuario: JSON.parse(usuario) });
      }
    },
};

const ProfileStore = createStore({
  name: 'ProfilesState',
  initialState,
  actions: actions,
});

export const useUsuarioStore = createHook(ProfileStore);
