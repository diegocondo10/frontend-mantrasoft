import PrivateLayout from '@src/layouts/PrivateLayout';
import { NextPage } from 'next';
import React from 'react';

const FormMedicamentosPage: NextPage<any> = ({ crudAction }) => {
  console.log(crudAction);
  return (
    <PrivateLayout>
      <main className="container-fluid">
        <h1></h1>
      </main>
    </PrivateLayout>
  );
};

export default FormMedicamentosPage;
