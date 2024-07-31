import classNames from 'classnames';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface DropDownProps extends Omit<DropdownProps, 'name' | 'defaultValue'> {
  controller: ControllerProps;
  block?: boolean;
}

const DropDown: React.FC<DropDownProps> = (props) => {
  const { controller, block, ...rest } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <Dropdown
          id={field.name}
          className={classNames(rest.className, { 'w-full': block })}
          invalid={fieldState.invalid}
          {...field}
          placeholder="SELECCIONAR"
          emptyMessage="Sin resultados"
          emptyFilterMessage="Sin resultados"
          {...rest}
        />
      )}
    />
  );
};

export default DropDown;
