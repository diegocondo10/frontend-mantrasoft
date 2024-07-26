import CONFIGS from '@src/constants/configs';
import { Perfil } from '@src/types/usuario';
import router from 'next/router';
import { useEffect, useMemo } from 'react';

const useUsuario = () => {
  const usuario = useMemo<Perfil | null>(() => {
    const usuarioJSON = localStorage.getItem('usuario') || null;
    const usuario = usuarioJSON !== null ? JSON.parse(usuarioJSON) : null;
    return usuario;
  }, []);

  const isValidSession = () => {
    const access = localStorage.getItem(CONFIGS.TOKEN_KEY);
    const refresh = localStorage.getItem(CONFIGS.REFRESH_TOKEN_KEY);
    if (access && refresh && usuario) {
      return true;
    }
    router.replace('/logout');
    return false;
  };

  useEffect(() => {
    isValidSession();
  }, [usuario]);

  const setUsuario = (data: Perfil) => {
    localStorage.setItem('usuario', JSON.stringify(data));
  };

  return {
    isValidSession,
    setUsuario,
    usuario,
  };
};

export default useUsuario;
