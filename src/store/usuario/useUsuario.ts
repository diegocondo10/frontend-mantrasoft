import CONFIGS from '@src/constants/configs';
import { useRouter } from 'next/dist/client/router';

const useUsuario = () => {
  const router = useRouter();

  const isValidSession = () => {
    const access = localStorage.getItem(CONFIGS.TOKEN_KEY);
    const refresh = localStorage.getItem(CONFIGS.REFRESH_TOKEN_KEY);
    if (access && refresh) {
      return true;
    }
    router.replace('/logout');
    return false;
  };

  return {
    isValidSession,
  };
};

export default useUsuario;
