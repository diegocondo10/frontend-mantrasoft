import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import PrivateLayout from '@src/layouts/PrivateLayout';
import classNames from 'classnames';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

const HabitacionFormPage: NextPage<any> = (props) => {

  const methods = useForm({ mode: 'onChange' });

  const _onSubmit = (formData) => {
    console.log(formData);
  };

  return(
    <PrivateLayout title="Registro de habitaciones">
      <main className="container-fluid">
        <div className="d-flex flex-row my-3 justify-content-center">
          <div className="align-self-center">
            <Button href="/habitaciones/" sm rounded icon={PrimeIcons.ARROW_LEFT} outlined />
          </div>
          <h3 className="text-center align-self-center">Registro de información</h3>
        </div>

        <div className="row justify-content-center">
          <div className="col-11 border">
            <div className="row justify-content-center">
              <div className="col-11">
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(_onSubmit)} className="row">
                    <div className="col-md-6">
                      <label htmlFor="ala">Ala: *</label>
                      <Controller
                        name="ala"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            inputId="ala"
                            options={['1', '2']}
                            {...field}
                            showClear
                            placeholder="Seleccione"
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="ala" />
                    </div>
                    <div className="col-md-6">
                      <label>N° de Habitación: *</label>
                      <Controller
                        name="numeroHabitacion"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="numeroHabitacion"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="numeroHabitacion" />
                    </div>
                    <div className="col-md-6">
                      <label>Capacidad: *</label>
                      <Controller
                        name="capacidad"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="capacidad"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="capacidad" />
                    </div>
                              
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-6">
                            <Button label="Regresar" block href="/habitaciones/" variant="info" />
                          </div>
                          <div className="col-md-6">
                            <Button label="Guardar" block type="submit" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PrivateLayout>

  );




  


};

export default HabitacionFormPage;
