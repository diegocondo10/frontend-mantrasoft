import PrivateLayout from '@src/layouts/PrivateLayout';
import { NextPage } from 'next';
import React from 'react';

const HorariosPage: NextPage<any> = () => {
  return (
    <PrivateLayout>
      <main className="container">
        <div className="row justify-content-center">
          <div className="col-12"></div>
        </div>
      </main>
    </PrivateLayout>
  );
};

export default HorariosPage;
