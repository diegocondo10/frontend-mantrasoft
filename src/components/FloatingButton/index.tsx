import classNames from 'classnames';
import { Button, ButtonProps } from 'primereact/button';
import React from 'react';
import styles from './styles.module.scss';

export interface FloatingButtonProps extends ButtonProps {}

const FloatingButton: React.FC<FloatingButtonProps> = ({ icon, onClick, className, ...rest }) => {
  return (
    <Button
      icon={icon}
      className={classNames('p-button-rounded', styles.floatingButton, className)}
      size="large"
      {...rest}
    />
  );
};

export default FloatingButton;
