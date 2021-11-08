import classNames from 'classnames';
import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

export interface LoadingWrapperProps {
  loading?: boolean;
  texto?: string;
  className?: string;
}

const Loading: React.FC<LoadingWrapperProps> = (props) => {
  if (!props.loading) {
    return <>{props.children}</>;
  }
  return (
    <div
      style={{ height: '100%', overflow: 'hidden' }}
      className={classNames('d-flex flex-column justify-content-center text-center', props?.className)}
    >
      <ProgressSpinner />
      <h4>{props.texto}</h4>
    </div>
  );
};

Loading.defaultProps = {
  loading: false,
  texto: 'Cargando...',
};

export default Loading;
