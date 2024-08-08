import CONFIGS from '@src/constants/configs';
import { Perfil } from '@src/types/usuario';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useUsuarioStore } from './store';

const useUsuario = () => {
  const [state, actions] = useUsuarioStore();

  const isValidSession = () => {
    const access = localStorage.getItem(CONFIGS.TOKEN_KEY);
    const refresh = localStorage.getItem(CONFIGS.REFRESH_TOKEN_KEY);
    const usuario = localStorage.getItem(CONFIGS.USER_KEY);
    if (access && refresh && usuario) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!state.usuario && isValidSession()) {
      setUsuario(JSON.parse(localStorage.getItem(CONFIGS.USER_KEY)));
    }
  }, []);

  const setUsuario = (data: Perfil) => {
    localStorage.setItem(CONFIGS.USER_KEY, JSON.stringify(data));
    actions.setUsuario(data);
  };

  const logOut = () => {
    Cookies.remove(CONFIGS.TOKEN_KEY);
    Cookies.remove(CONFIGS.USER_KEY);
  };

  return {
    isValidSession,
    setUsuario,
    usuario: state.usuario,
    logOut,
  };
};

export default useUsuario;
