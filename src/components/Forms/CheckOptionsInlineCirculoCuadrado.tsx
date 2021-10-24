import React from 'react';
import { Controller } from 'react-hook-form';
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
              key={option.controller.name}
              {...option.controller}
              render={({ field }) => (
                <div className="d-inline-flex flex-wrap me-5">
                  <div className="d-inline-flex flex-wrap">
                    <div>
                      <label className="me-2">{option.labelText}</label>

                      <input
                        className="align-self-center checkbox-round"
                        type="checkbox"
                        id={`${option.labelText}-circulo`}
                        checked={field.value?.circuloChecked}
                        onChange={(evt) =>
                          field.onChange({
                            ...option.valueCirculo,
                            label: option.labelText,
                            circuloChecked: evt.target.checked,
                            cuadradoChecked: false,
                          })
                        }
                      />

                      <input
                        className="align-self-center ms-2 checkbox-cuadrado"
                        type="checkbox"
                        checked={field.value?.cuadradoChecked}
                        style={{
                          borderRadius: '50%',
                        }}
                        onChange={(evt) =>
                          field.onChange({
                            ...option.valueCirculo,
                            label: option.labelText,
                            cuadradoChecked: evt.target.checked,
                            circuloChecked: false,
                          })
                        }
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

export default CheckOptionsInlineCirculoCuadrado;
