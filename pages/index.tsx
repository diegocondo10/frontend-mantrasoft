import Button from '@src/components/Button';
import ROLES from '@src/constants/roles';
import PrivateLayout from '@src/layouts/PrivateLayout';
import useUsuario from '@src/store/usuario/useUsuario';
import moment from 'moment';
import type { NextPage } from 'next';
import router from 'next/router';
import React, { useRef } from 'react';

const Home: NextPage<any> = () => {
  const { usuario, tieneRol } = useUsuario();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <PrivateLayout loading={{ loading: false }}>
      <main className="container">
        <h1 className="display-6 text-center mt-5">Bienvenido</h1>
        <h4 className="text-center">Que deseas hacer?</h4>
        {tieneRol(ROLES.ENFERMERA) && (
          <React.Fragment>
            <div className="row g-1 align-items-center">
              <div className="col-auto">
                <input
                  className="form-control form-control-lg"
                  type="date"
                  ref={ref}
                  defaultValue={moment().format('YYYY-MM-DD')}
                  max={moment().format('YYYY-MM-DD')}
                />
              </div>
              <div className="col-auto">
                <Button
                  outlined
                  variant="info"
                  label="Consultar mi horario"
                  onClick={() => {
                    const fecha = ref?.current?.value;
                    if (ref?.current?.value !== '') {
                      router.push(`/horarios/detalle?id=${usuario?.id}&startDate=${fecha}&endDate=${fecha}`);
                    }
                  }}
                />
              </div>
            </div>
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

Home.help = {
  title: 'Pagina de inicio',
  content: 'Dashboard de presentación de la página',
};
export default Home;
