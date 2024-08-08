import ResumenMedicacion from '@src/components/ResumenMedicacion';
import PrivateLayout from '@src/layouts/PrivateLayout';
import useUsuario from '@src/store/usuario/useUsuario';
import { CustomNextPage } from '@src/types/next';
import React from 'react';

const Home: CustomNextPage<any> = () => {
  const { usuario } = useUsuario();

  return (
    <PrivateLayout loading={{ loading: false }}>
      <main className="grid grid-nogutter">
        <div className="col-12 text-center">
          <h1 className="text-5xl">¡BIENVENIDO!</h1>
          <h3>{usuario.fullName}</h3>
        </div>
        {usuario.isEnfermera && <ResumenMedicacion />}
      </main>
    </PrivateLayout>
  );
};

Home.help = {
  title: 'Pagina de inicio',
  content: 'Dashboard de presentación de la página',
};

Home.isPrivate = true;

export default Home;
