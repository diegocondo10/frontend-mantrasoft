import classNames from 'classnames';
import { InputText, InputTextProps } from 'primereact/inputtext';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface TextInputProps extends Omit<InputTextProps, 'name' | 'defaultValue'> {
  controller: ControllerProps;
  block?: boolean;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const { controller, block, ...rest } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <InputText
          id={field.name}
          {...rest}
          className={classNames(rest.className, { 'p-invalid': fieldState.invalid, 'w-full': block })}
          {...field}
        />
      )}
    />
  );
};

export default TextInput;
