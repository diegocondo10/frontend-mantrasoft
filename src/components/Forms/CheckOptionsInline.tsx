import { Checkbox } from 'primereact/checkbox';
import React from 'react';
import { Controller } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { ControllerProps } from './types';

export interface CheckBoxOption {
  labelText?: string;
  value?: string | any;
}
export interface CheckOptionsInlineProps {
  controller: ControllerProps;
  options: CheckBoxOption[];
  label?: string;
}

const CheckOptionsInline: React.FC<CheckOptionsInlineProps> = (props) => {
  const { controller } = props;
  return (
    <Controller
      {...controller}
      render={({ field }) => (
        <div className="flex flex-column">
          <div className="flex flex-row flex-wrap align-items-center">
            <label className="mr-3 font-bold w-full md:w-max">{props.label}</label>
            {props.options.map((option) => (
              <div key={option.labelText} className="w-full md:w-max">
                <label className="sm:mr-3 align-self-center" htmlFor={option.labelText}>
                  {option.labelText}
                  <Checkbox
                    className="align-self-center ml-2"
                    type="checkbox"
                    checked={field.value === option.value}
                    inputId={option.labelText}
                    onChange={() => field.onChange(option.value)}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="text-center">
            <ErrorMessage name={controller.name} />
          </div>
        </div>
      )}
    />
  );
};

export default CheckOptionsInline;
