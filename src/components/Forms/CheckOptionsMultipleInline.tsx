import { Checkbox } from 'primereact/checkbox';
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
        {props.label && <label className="mr-3 w-full font-bold text-xl">{props.label}</label>}
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
                <div className="flex flex-row w-full md:w-max md:mr-5 my-1">
                  <label className="align-self-center" htmlFor={option.labelText}>
                    {option.labelText}
                    <HiddenField name={`${option.controller.name}.label`} defaultValue={option.labelText} />
                    <HiddenField name={`${option.controller.name}.value`} defaultValue={option.value} />
                  </label>
                  <Checkbox
                    className="align-self-center ml-1"
                    type="checkbox"
                    inputId={option.labelText}
                    checked={field.value?.checked}
                    onChange={(evt) => {
                      field.onChange({
                        checked: evt.target.checked,
                      });
                    }}
                  />
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
