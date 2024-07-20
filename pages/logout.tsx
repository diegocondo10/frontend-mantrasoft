import CONFIGS from '@src/constants/configs';
import PublicLayout from '@src/layouts/PublicLayout';
import { CustomNextPage } from '@src/types/next';
import Router from 'next/router';
import { useEffect } from 'react';

const LogOutPage: CustomNextPage = () => {
  useEffect(() => {
    localStorage.removeItem(CONFIGS.TOKEN_KEY);
    localStorage.removeItem(CONFIGS.REFRESH_TOKEN_KEY);
    Router.replace('/login');
  }, []);

  return <PublicLayout loading={{ loading: true }} />;
};

export default LogOutPage;
