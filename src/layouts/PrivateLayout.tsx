/* eslint-disable react-hooks/exhaustive-deps */
import PrivateNavbar from '@src/components/Navbars/PrivateNavbar';
import API from '@src/services/api';
import { urlPerfil } from '@src/services/urls';
import useUsuario from '@src/store/usuario/useUsuario';
import React from 'react';
import { useQuery } from 'react-query';
import BaseLayout, { BaseLayoutProps } from './BaseLayout';

export interface PrivateLayoutProps extends BaseLayoutProps {}

const PrivateLayout: React.FC<PrivateLayoutProps> = (props) => {
  const { children, ...rest } = props;
  const { isValidSession, setUsuario } = useUsuario();

  const { isLoading } = useQuery(['perfil'], () => API.private().post(urlPerfil), {
    refetchOnWindowFocus: false,
    onError: () => {
      console.log('ERROR');
    },
    onSuccess: ({ data }) => {
      setUsuario(data);
    },
    enabled: isValidSession(),
  });

  return (
    <BaseLayout
      {...rest}
      loading={{
        loading: isLoading || props?.loading?.loading,
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
