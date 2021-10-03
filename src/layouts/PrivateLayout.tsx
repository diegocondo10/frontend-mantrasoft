/* eslint-disable react-hooks/exhaustive-deps */
import PrivateNavbar from '@src/components/Navbars/PrivateNavbar';
import useUsuario from '@src/store/usuario/useUsuario';
import React, { useEffect } from 'react';
import BaseLayout, { BaseLayoutProps } from './BaseLayout';

export interface PrivateLayoutProps extends BaseLayoutProps {}

const PrivateLayout: React.FC<PrivateLayoutProps> = (props) => {
  const { children, ...rest } = props;
  const { isValidSession } = useUsuario();

  useEffect(() => {
    isValidSession();
  }, []);

  return <BaseLayout {...rest}>{children}</BaseLayout>;
};

PrivateLayout.defaultProps = {
  header: <PrivateNavbar />,
};

export default PrivateLayout;
