import PrivateLayout from '@src/layouts/PrivateLayout';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <PrivateLayout loading={{ loading: false }}>
      <main className="container">
        <h1 className="display-6 text-center mt-5">Bienvenido</h1>
      </main>
    </PrivateLayout>
  );
};

export default Home;
