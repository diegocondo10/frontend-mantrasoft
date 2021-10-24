import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface CheckBoxOption {
  controller: ControllerProps;
  labelText?: string;
  value?: string | any;
}
export interface CheckOptionsMultipleInlineProps {
  options: CheckBoxOption[];
  label?: string;
}

const CheckOptionsMultipleInline: React.FC<CheckOptionsMultipleInlineProps> = (props) => {
  return (
    <React.Fragment>
      <div className="d-flex flex-row flex-wrap">
        {props.label && <label className="me-3 w-100 font-bold">{props.label}</label>}
        <div>
          {props.options.map((option) => (
            <Controller
              key={option.controller.name}
              {...option.controller}
              render={({ field }) => (
                <div className="d-inline-flex flex-wrap me-5">
                  <div className="d-inline-flex flex-wrap">
                    <div>
                      <label htmlFor={option.labelText}>{option.labelText}</label>
                      <input
                        className="align-self-center ms-1"
                        type="checkbox"
                        id={option.labelText}
                        checked={field.value}
                        onChange={(evt) => field.onChange(evt.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default CheckOptionsMultipleInline;
