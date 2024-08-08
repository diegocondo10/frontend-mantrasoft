import PublicLayout from '@src/layouts/PublicLayout';
import useUsuario from '@src/store/usuario/useUsuario';
import { CustomNextPage } from '@src/types/next';
import Router from 'next/router';
import { useEffect } from 'react';

const LogOutPage: CustomNextPage = () => {
  const { logOut } = useUsuario();

  useEffect(() => {
    logOut();
    Router.replace('/login');
  }, []);

  return <PublicLayout loading={{ loading: true }} />;
};

export default LogOutPage;
