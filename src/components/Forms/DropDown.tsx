import React from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { Controller } from 'react-hook-form';
import classNames from 'classnames';
import { ControllerProps } from './types';

export interface DropDownProps extends Omit<DropdownProps, 'name' | 'defaultValue'> {
  controller: ControllerProps;
  block?: boolean;
}

const DropDown: React.FC<DropDownProps> = (props) => {
  const { controller, ...rest } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <Dropdown
          id={field.name}
          {...rest}
          className={classNames(rest.className, { 'p-invalid': fieldState.invalid, 'w-full': props.block })}
          {...field}
          placeholder="SELECCIONAR"
          emptyMessage="Sin resultados"
          emptyFilterMessage="Sin resultados"
        />
      )}
    />
  );
};

export default DropDown;
