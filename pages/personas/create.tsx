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
import { Calendar } from 'primereact/calendar';

const CreatePersonaPage: NextPage<any> = () => {
  const methods = useForm({ mode: 'onChange' });

  const _onSubmit = (formData) => {
    console.log(formData);
  };

  return (
    <PrivateLayout title="Registro de personas">
      <main className="container-fluid">
        <div className="d-flex flex-row my-3 justify-content-center">
          <div className="align-self-center">
            <Button href="/personas" sm rounded icon={PrimeIcons.ARROW_LEFT} outlined />
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
                      <label htmlFor="tipoIdentificacion">Tipo de identificación: *</label>
                      <Controller
                        name="tipoIdentificacion"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            inputId="tipoIdentificacion"
                            options={['CEDULA', 'PASAPORTE', 'OTRO']}
                            {...field}
                            showClear
                            placeholder="Seleccione"
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="tipoIdentificacion" />
                    </div>
                    <div className="col-md-6">
                      <label>Identificación: *</label>
                      <Controller
                        name="identificacion"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="identificacion"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="identificacion" />
                    </div>
                    <div className="col-md-6">
                      <label>Primer Nombre: *</label>
                      <Controller
                        name="primerNombre"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="primerNombre"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="primerNombre" />
                    </div>
                    <div className="col-md-6">
                      <label>Segundo Nombre: *</label>
                      <Controller
                        name="segundoNombre"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="segundoNombre"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="segundoNombre" />
                    </div>
                    <div className="col-md-6">
                      <label>Primer Apellido: *</label>
                      <Controller
                        name="primerApellido"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="primerApellido"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="primerApellido" />
                    </div>
                    <div className="col-md-6">
                      <label>Segundo Apellido: *</label>
                      <Controller
                        name="segundoApellido"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="segundoApellido"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="segundoApellido" />
                    </div>
                    <div className="col-md-6">
                      <label>Fecha de Nacimiento: *</label>
                      <Controller
                        name="fechaNacimiento"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Calendar
                            id="fechaNacimiento"
                            dateFormat="dd/mm/yy" 
                            monthNavigator
                            yearNavigator
                            yearRange="1930:2030"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })} 
                          />
                        )}
                      />
                      <ErrorMessage name="fechaNacimiento" />
                    </div>
                    <div className="col-md-6">
                      <label>Celular: *</label>
                      <Controller
                        name="celular"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="celular"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="celular" />
                    </div>
                    <div className="col-md-6">
                      <label>Teléfono: *</label>
                      <Controller
                        name="telefono"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="telefono"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="telefono" />
                    </div>
                    {/** ESpecial**/}
                    <div className="col-md-6">
                      <label>Correo: *</label>
                      <Controller
                        name="correo"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="correo"
                            type="email"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="correo" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="estadoCivil">Estado Civil: *</label>
                      <Controller
                        name="estadoCivil"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            inputId="estadoCivil"
                            options={['SOLTERO', 'CASADO', 'DIVORCIADO','VIUDO','UNION LIBRE']}
                            {...field}
                            showClear
                            placeholder="Seleccione"
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="estadoCivil" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="genero">Género: *</label>
                      <Controller
                        name="genero"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            inputId="genero"
                            options={['MASCULINO', 'FEMENINO']}
                            {...field}
                            showClear
                            placeholder="Seleccione"
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="genero" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="sexo">Sexo: *</label>
                      <Controller
                        name="genero"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            inputId="sexo"
                            options={['HOMBRE','MUJER','OTRO']}
                            {...field}
                            showClear
                            placeholder="Seleccione"
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="sexo" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="sexo">Tipo de Sangre: *</label>
                      <Controller
                        name="tipoSangre"
                        render={({field}) => (
                          <Dropdown
                            inputId="tipoSangre"
                            options={['A+', 'A-','B+','B-','O+','O-','AB+','AB-']}
                            {...field}
                            showClear
                            placeholder="Seleccione"
                            className={classNames('w-full')}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Calle Principal: *</label>
                      <Controller
                        name="callePrincipal"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="callePrincipal"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="callePrincipal" />
                    </div>
                    <div className="col-md-6">
                      <label>Número de casa:</label>
                      <Controller
                        name="numeroCasa"
                        render={({ field }) => (
                          <InputText
                            id="NumeroCasa"
                            {...field}
                            className={classNames('w-full')}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Calle Secundaria: *</label>
                      <Controller
                        name="calleSecundaria"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="calleSecundaria"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="calleSecundaria" />
                    </div>
                    <div className="col-md-6">
                      <label>Referencia:</label>
                      <Controller
                        name="referencia"
                        render={({ field }) => (
                          <InputText
                            id="referencia"
                            {...field}
                            className={classNames('w-full')}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Sector:</label>
                      <Controller
                        name="sector"
                        render={({ field }) => (
                          <InputText
                            id="sector"
                            {...field}
                            className={classNames('w-full')}
                          />
                        )}
                      />
                    </div>
                    
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-6">
                            <Button label="Regresar" block href="/personas" variant="info" />
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

export default CreatePersonaPage;
