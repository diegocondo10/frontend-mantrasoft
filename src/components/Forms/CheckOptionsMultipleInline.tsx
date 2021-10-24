import React from 'react';
import { Controller } from 'react-hook-form';
import HiddenField from './HiddenField';
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
              key={option.labelText}
              {...option.controller}
              defaultValue={{
                checked: false,
                ...option.controller?.defaultValue,
              }}
              render={({ field }) => (
                <div className="d-inline-flex flex-wrap w-full md:w-max md:mr-5">
                  <div className="d-inline-flex flex-wrap">
                    <label style={{ fontSize: '1.25rem' }} htmlFor={option.labelText}>
                      {option.labelText}
                      <HiddenField name={`${option.controller.name}.label`} defaultValue={option.labelText} />
                      <HiddenField name={`${option.controller.name}.value`} defaultValue={option.value} />
                      <input
                        className="align-self-center ms-1"
                        type="checkbox"
                        id={option.labelText}
                        checked={field.value?.checked}
                        onChange={(evt) => {
                          field.onChange({
                            checked: evt.target.checked,
                          });
                        }}
                      />
                    </label>
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
