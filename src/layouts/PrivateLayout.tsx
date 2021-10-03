/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@apollo/client';
import PrivateNavbar from '@src/components/Navbars/PrivateNavbar';
import { myPerfil } from '@src/graphql/Auth.queries.gql';
import useUsuario from '@src/store/usuario/useUsuario';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import BaseLayout, { BaseLayoutProps } from './BaseLayout';

export interface PrivateLayoutProps extends BaseLayoutProps {}

const PrivateLayout: React.FC<PrivateLayoutProps> = (props) => {
  const { children, ...rest } = props;
  const { isValidSession } = useUsuario();

  const router = useRouter();

  const { loading } = useQuery(myPerfil, {
    onCompleted: ({ perfil }) => {
      if (!perfil?.username) {
        router.replace('/logout');
      }
    },
  });

  useEffect(() => {
    isValidSession();
  }, []);

  return (
    <BaseLayout
      {...rest}
      loading={{
        loading: loading || props?.loading?.loading,
        texto: props?.loading?.texto,
      }}
    >
      {children}
    </BaseLayout>
  );
};

PrivateLayout.defaultProps = {
  header: <PrivateNavbar />,
};

export default PrivateLayout;
