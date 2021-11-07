import classNames from 'classnames';

import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface TextAreaProps extends Omit<InputTextareaProps, 'name' | 'defaultValue' | 'ref' | 'onChange'> {
  controller: ControllerProps;
  block?: boolean;
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { controller, ...rest } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <React.Fragment>
          {/*@ts-ignore */}
          <InputTextarea
            id={field.name}
            {...rest}
            className={classNames(rest.className, { 'p-invalid': fieldState.invalid, 'w-full': props.block })}
            {...field}
          />
        </React.Fragment>
      )}
    />
  );
};

export default TextArea;
