import CONFIGS from '@src/constants/configs';
import router from 'next/router';

const useUsuario = () => {
  const usuarioJSON: any = localStorage.getItem('usuario') || null;
  const usuario = usuarioJSON !== null ? JSON.parse(usuarioJSON) : null;

  const isValidSession = () => {
    const access = localStorage.getItem(CONFIGS.TOKEN_KEY);
    const refresh = localStorage.getItem(CONFIGS.REFRESH_TOKEN_KEY);
    if (access && refresh) {
      return true;
    }
    router.replace('/logout');
    return false;
  };

  const tienePermiso = (permiso: string) => {
    return true;
    return usuario?.permisos?.some?.((item: string) => item === permiso);
  };

  const tieneRol = (rol: string) => {
    return usuario?.roles?.some?.((item) => item?.codigo === rol);
  };
  const activarOptionNavbarByPermiso = (permiso: string) => {
    if (!tienePermiso(permiso)) {
      return { className: 'd-none', disabled: true };
    }
    return {};
  };
  return {
    isValidSession,
    setUsuario: (data: any) => {
      localStorage.setItem('usuario', JSON.stringify(data));
    },
    usuario,
    tienePermiso,
    tieneRol,
    activarOptionNavbarByPermiso,
  };
};

export default useUsuario;
