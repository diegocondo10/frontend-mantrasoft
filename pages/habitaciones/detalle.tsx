import Button from '@src/components/Button';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDetailHabitacion } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import React from 'react';
import { useQuery } from 'react-query';

const DetalleHabitacionPage: NextPage<any> = ({ id }) => {
  const query = useQuery(['habitacion', id], () => API.private().get(urlDetailHabitacion(id)), {
    enabled: id !== undefined,
    onError(err) {
      console.log(err);
      alert('No se ha podido encontrar el registro');
      router.push('/habitaciones');
    },
  });
  const habitacion: any = query?.data?.data;
  return(
    <PrivateLayout>
      <main className="container">
        <div className="row justify-content-center">
          <h1 className="text-center my-5">
            <Button icon={PrimeIcons.ARROW_LEFT} rounded outlined href="/habitaciones" /> Información de la habitación
          </h1>
          <div className="col-11 border">
            <div className="row justify-content-center">
              <div className="col-11">
                <p>
                  <strong>Ala: </strong>
                  {habitacion?.ala}
                </p>
                <p>
                  <strong>Número: </strong>
                  {habitacion?.numero}
                </p>
                <p>
                  <strong>Capacidad de Pacientes: </strong>
                  {habitacion?.capacidadPacientes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};
DetalleHabitacionPage.getInitialProps = ({ query }) => query as any;

export default DetalleHabitacionPage;
