import React from 'react';
import ReactToggle from 'react-bootstrap-toggle';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface ToggleProps extends ControllerProps {
  on?: string | any;
  off?: string | any;
  size?: 'sm' | 'lg' | 'md';
  offstyle?: 'primary' | 'secondary' | 'dark';
  onstyle?: 'primary' | 'secondary' | 'dark';
  onClick?: any;
  active?: boolean;
}

const Toggle: React.FC<ToggleProps> = (props) => {
  return (
    <Controller
      name={props.name}
      rules={props.rules}
      defaultValue={props.defaultValue}
      render={({ field }) => (
        <ReactToggle
          onClick={field.onChange}
          on={props?.on || 'SI'}
          off={props?.on || 'NO'}
          size={props.size || 'lg'}
          handleClassName="bg-white"
          offstyle={props.offstyle || 'dark'}
          onstyle={props.offstyle || 'primary'}
          active={field.value}
        />
      )}
    />
  );
};

export default Toggle;
