import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface HiddenFieldProps extends ControllerProps {}
const HiddenField: React.FC<HiddenFieldProps> = (props) => {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      shouldUnregister={props.shouldUnregister}
      rules={props.rules}
      render={({ field }) => <small hidden>{JSON.stringify(field.value)}</small>}
    />
  );
};

export default HiddenField;
