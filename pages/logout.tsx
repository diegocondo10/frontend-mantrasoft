import CONFIGS from '@src/constants/configs';
import PublicLayout from '@src/layouts/PublicLayout';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';

const LogOutPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem(CONFIGS.TOKEN_KEY);
    localStorage.removeItem(CONFIGS.REFRESH_TOKEN_KEY);
    router.replace('/login');
  }, []);

  return <PublicLayout loading={{ loading: true }} />;
};

export default LogOutPage;
