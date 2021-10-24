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
        <div className="d-flex flex-column">
          <div className="d-inline-flex flex-wrap">
            <label>{props.label}</label>
            <div className="d-inline-flex flex-wrap">
              {props.options.map((option) => (
                <div key={option.labelText}>
                  <label className="ms-4 me-2" htmlFor={option.labelText}>
                    {option.labelText}
                  </label>
                  <input
                    className="align-self-center"
                    type="checkbox"
                    //   value={option.value}
                    checked={field.value === option.value}
                    id={option.labelText}
                    onChange={() => field.onChange(option.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <ErrorMessage name={controller.name} />
        </div>
      )}
    />
  );
};

export default CheckOptionsInline;
