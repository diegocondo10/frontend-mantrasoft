import Button from '@src/components/Button';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDetailPersona } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import React from 'react';
import { useQuery } from 'react-query';

const DetallePersonaPage: NextPage<{ id: string }> = ({ id }) => {
  const queryPersona = useQuery<AxiosResponse<any>>(['persona', id], () => API.private().get(urlDetailPersona(id)));
  const persona = queryPersona?.data?.data;
  return (
    <PrivateLayout>
      <main className="container">
        <div className="row justify-content-center">
          <h1 className="text-center my-5">
            <Button icon={PrimeIcons.ARROW_LEFT} rounded outlined href="/personas" /> Información de la persona
          </h1>
          <div className="col-11 border">
            <div className="row justify-content-center">
              <div className="col-11">
                <p>
                  <strong>Identificación: </strong>
                  {persona?.identificacion}
                </p>
                <p>
                  <strong>Tipo identificación: </strong>
                  {persona?.tipoIdentificacion}
                </p>
                <p>
                  <strong>Identificación: </strong>
                  {persona?.identificacion}
                </p>
                <p>
                  <strong>Identificación: </strong>
                  {persona?.identificacion}
                </p>
                <p>
                  <strong>Identificación: </strong>
                  {persona?.identificacion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};

DetallePersonaPage.getInitialProps = ({ query }) => query as any;

export default DetallePersonaPage;
