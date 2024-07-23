import PrivateLayout from '@src/layouts/PrivateLayout';
import useUsuario from '@src/store/usuario/useUsuario';
import { CustomNextPage } from '@src/types/next';
import React from 'react';

const Home: CustomNextPage<any> = () => {
  const { usuario } = useUsuario();

  return (
    <PrivateLayout loading={{ loading: false }}>
      <main className="container">
        <h1 className="text-center text-5xl">¡BIENVENIDO!</h1>
        <h3 className="text-center">{usuario.fullName}</h3>
        {usuario.isEnfermera && (
          <React.Fragment>
            <div className="row g-1 align-items-center"></div>
            <div className="row">
              <div className="col-12">
                <h3 className="text-center">Resumen</h3>
              </div>
            </div>
          </React.Fragment>
        )}
      </main>
    </PrivateLayout>
  );
};

Home.help = {
  title: 'Pagina de inicio',
  content: 'Dashboard de presentación de la página',
};
export default Home;
