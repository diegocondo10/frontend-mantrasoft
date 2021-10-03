import PrivateNavbar from '@src/components/Navbars/PrivateNavbar';
import React from 'react';
import BaseLayout, { BaseLayoutProps } from './BaseLayout';

export interface PrivateLayoutProps extends BaseLayoutProps {}

const PrivateLayout: React.FC<PrivateLayoutProps> = (props) => {
  const { children, ...rest } = props;
  return <BaseLayout {...rest}>{children}</BaseLayout>;
};

PrivateLayout.defaultProps = {
  header: <PrivateNavbar />,
};

export default PrivateLayout;
