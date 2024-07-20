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
      <div className="d-flex flex-row flex-wrap">
        {props.label && <label className="me-3 font-bold">{props.label}</label>}
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
                <div className="d-inline-flex flex-wrap me-5 w-full md:w-max">
                  <div className="d-inline-flex flex-wrap">
                    <div>
                      <label style={{ fontSize: '1.25rem' }} className="me-2 select-all">
                        {option.labelText}
                      </label>
                      <HiddenField name={`${option.controller.name}.label`} defaultValue={option.labelText} />
                      <HiddenField name={`${option.controller.name}.valueCirculo`} defaultValue={option.valueCirculo} />
                      <HiddenField
                        name={`${option.controller.name}.valueCuadrado`}
                        defaultValue={option.valueCuadrado}
                      />
                      <div className="d-inline-block">
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
                          className="align-self-center ms-2 checkbox-cuadrado"
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
