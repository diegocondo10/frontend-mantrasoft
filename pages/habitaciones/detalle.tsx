import API from '@src/services/api';
import { urlDetailHabitacion } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
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
  return <div></div>;
};
DetalleHabitacionPage.getInitialProps = ({ query }) => query as any;

export default DetalleHabitacionPage;
