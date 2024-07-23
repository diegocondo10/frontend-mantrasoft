import React from 'react';
import { Controller } from 'react-hook-form';
import HiddenField from './HiddenField';
import { ControllerProps } from './types';

export interface CheckBoxOption {
  labelText?: string;
  valueCirculo?: string | any;
  valueCuadrado?: string | any;
  value?: string | any;
  controller: ControllerProps;
}
export interface CheckOptionsInlineCirculoCuadradoProps {
  options: CheckBoxOption[];
  label?: string;
}
const CheckOptionsInlineCirculoCuadrado: React.FC<CheckOptionsInlineCirculoCuadradoProps> = (props) => {
  return (
    <React.Fragment>
      <div className="flex flex-row flex-wrap">
        {props.label && <label className="me-3 font-bold w-full text-xl">{props.label}</label>}
        <div>
          {props.options.map((option) => (
            <Controller
              key={option.labelText}
              {...option.controller}
              defaultValue={{
                circuloChecked: false,
                cuadradoChecked: false,
                ...option.controller.defaultValue,
              }}
              render={({ field }) => (
                <div className="flex flex-wrap mr-5 w-full my-2">
                  <label className="mr-2 select-all align-self-center">{option.labelText}</label>
                  <HiddenField name={`${option.controller.name}.label`} defaultValue={option.labelText} />
                  <HiddenField name={`${option.controller.name}.valueCirculo`} defaultValue={option.valueCirculo} />
                  <HiddenField name={`${option.controller.name}.valueCuadrado`} defaultValue={option.valueCuadrado} />
                  <div className="flex flex-row">
                    <input
                      className="align-self-center checkbox-round"
                      type="checkbox"
                      id={`${option.labelText}-circulo`}
                      checked={field.value?.circuloChecked}
                      onChange={(evt) =>
                        field.onChange({
                          circuloChecked: evt.target.checked,
                          cuadradoChecked: false,
                        })
                      }
                    />

                    <input
                      className="align-self-center ml-2 checkbox-cuadrado"
                      type="checkbox"
                      checked={field.value?.cuadradoChecked}
                      onChange={(evt) =>
                        field.onChange({
                          cuadradoChecked: evt.target.checked,
                          circuloChecked: false,
                        })
                      }
                    />
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

export default CheckOptionsInlineCirculoCuadrado;
