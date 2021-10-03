import PublicLayout from '@src/layouts/PublicLayout';
import { NextPage } from 'next';
import React from 'react';

const LoginPage: NextPage<any> = () => {
  return (
    <PublicLayout>
      <main className="container">
        <h1>Login</h1>
      </main>
    </PublicLayout>
  );
};

export default LoginPage;
