import PrivateNavbar from '@src/components/Navbars/PrivateNavbar';
import useToasts from '@src/hooks/useToasts';
import API from '@src/services/api';
import { urlPerfil } from '@src/services/urls';
import useUsuario from '@src/store/usuario/useUsuario';
import { commandPush } from '@src/utils/router';
import { useRouter } from 'next/router';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import React from 'react';
import { useQuery } from 'react-query';
import BaseLayout, { BaseLayoutProps } from './BaseLayout';

export interface PrivateLayoutProps extends BaseLayoutProps {
  breadCrumbItems?: MenuItem[] | undefined;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children, breadCrumbItems = [], ...rest }) => {
  const router = useRouter();

  const { isValidSession, setUsuario } = useUsuario();

  const toast = useToasts();

  const { isLoading } = useQuery('perfil', () => API.private().post(urlPerfil), {
    refetchOnWindowFocus: false,
    onError: () => {
      router.replace('/logout');
      toast.addErrorToast('No tienes una sesión de usuario');
    },
    onSuccess: ({ data }) => {
      setUsuario(data);
    },
    refetchInterval: 1000 * 60 * 30,
    refetchIntervalInBackground: true,
    enabled: isValidSession(),
  });

  return (
    <BaseLayout
      {...rest}
      header={
        <>
          <PrivateNavbar />
          {breadCrumbItems.length > 0 && (
            <BreadCrumb
              model={breadCrumbItems}
              home={{
                label: 'Inicio',
                command: commandPush('/'),
              }}
            />
          )}
        </>
      }
      loading={{
        loading: isLoading || rest.loading?.loading,
        texto: rest.loading?.texto,
      }}
    >
      {children}
    </BaseLayout>
  );
};

export default PrivateLayout;
