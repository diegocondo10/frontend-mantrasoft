import React from 'react';
import BaseLayout, { BaseLayoutProps } from './BaseLayout';

export interface PublicLayoutProps extends BaseLayoutProps {}

const PublicLayout: React.FC<PublicLayoutProps> = (props) => {
  const { children, ...rest } = props;
  return <BaseLayout {...rest}>{children}</BaseLayout>;
};

export default PublicLayout;
