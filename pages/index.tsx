import ROLES from '@src/constants/roles';
import PrivateLayout from '@src/layouts/PrivateLayout';
import useUsuario from '@src/store/usuario/useUsuario';
import moment from 'moment';
import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const Home: NextPage<any> = ({ today }) => {
  const { usuario, tieneRol } = useUsuario();
  return (
    <PrivateLayout loading={{ loading: false }}>
      <main className="container">
        <h1 className="display-6 text-center mt-5">Bienvenido</h1>
        {tieneRol(ROLES.ENFERMERA) && (
          <React.Fragment>
            <Link href={`/horarios/detalle?id=${usuario?.id}&startDate=${today}&endDate=${today}`}>
              <a href="#">Consultar mi horario de hoy</a>
            </Link>
          </React.Fragment>
        )}
      </main>
    </PrivateLayout>
  );
};
Home.getInitialProps = ({ query }) => {
  const today = moment().format('YYYY-MM-DD');
  return {
    ...query,
    today,
  };
};
export default Home;
