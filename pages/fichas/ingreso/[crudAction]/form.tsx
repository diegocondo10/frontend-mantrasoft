import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoForm } from '@src/services/urls';
import classNames from 'classnames';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

const FichaIngresoFormPage: NextPage<{ id: string | number; crudAction: CrudActions }> = (props) => {
  const methods = useForm({ mode: 'onChange' });

  const queryCatalogo = useQuery<any>(['pacientes-ficha'], () => API.private().get<any>(urlCatalogoForm));

  const onSubmit = async (formData) => {
    console.log(formData);
  };

  return (
    <PrivateLayout title="Ficha ingreso">
      <main className="container-fluid">
        <div className="text-center d-flex justify-content-center my-3">
          <Button
            className="align-self-center"
            rounded
            sm
            outlined
            icon={PrimeIcons.ARROW_LEFT}
            href="/fichas/ingreso"
          />
          <h1 className="align-self-center">Ficha Ingreso</h1>
        </div>
        <FormProvider {...methods}>
          <form className="row justify-content-center" onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="md:col-8 lg:col-6">
              <label htmlFor="paciente" className="w-full">
                Buscar paciente: *
              </label>
              <Controller
                name="paciente"
                rules={{
                  required: 'Este campo es obligatorio',
                }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    autoFocus
                    options={queryCatalogo?.data?.data?.pacientes || []}
                    className={classNames('w-full', {
                      'p-invalid': fieldState.invalid,
                    })}
                    {...field}
                  />
                )}
              />
              <ErrorMessage name="paciente" />
            </div>

            <div className="md:col-8 lg:col-5">
              <label htmlFor="paciente" className="w-full">
                Buscar Habitación: *
              </label>
              <Controller
                name="habitacion"
                rules={{
                  required: 'Este campo es obligatorio',
                }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    autoFocus
                    options={queryCatalogo?.data?.data?.habitaciones || []}
                    className={classNames('w-full', {
                      'p-invalid': fieldState.invalid,
                    })}
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={(option) => (
                      <div className="d-flex flex-column">
                        <div>{option.label}</div>
                        <div className="ms-1">Habitaciones:</div>
                      </div>
                    )}
                    {...field}
                  />
                )}
              />
              <ErrorMessage name="habitacion" />
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <h4>INFORMACIÓN GENERAL</h4>
                  <div>
                    <label htmlFor="">VIVE CON: *</label>
                    <InputText className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="">OCUPACIÓN ANTERIOR: *</label>
                    <InputText className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="">OCUPACIÓN ACTUAL: *</label>
                    <InputText className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label>MOTIVO DE CONSULTA: *</label>
                    <Controller
                      name="informante"
                      rules={{
                        required: 'Es necesario seleccionar un tipo de informante',
                      }}
                      render={({ field }) => (
                        <div className="d-flex flex-column">
                          <div className="d-inline-flex">
                            <label htmlFor="" className=" me-3">
                              INFORMANTE: *
                            </label>
                            <label htmlFor="input-usuario" className="mx-2">
                              USUARIO
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="USUARIO"
                              checked={field.value === 'USUARIO'}
                              id="input-usuario"
                              onChange={() => field.onChange('USUARIO')}
                            />

                            <label className="ms-4 me-2" htmlFor="input-cuidador">
                              CUIDADOR
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CUIDADOR"
                              checked={field.value === 'CUIDADOR'}
                              id="input-cuidador"
                              onChange={() => field.onChange('CUIDADOR')}
                            />
                          </div>
                          <ErrorMessage name="informante" />
                        </div>
                      )}
                    />
                  </div>

                  <Controller
                    name="motivoConsulta"
                    rules={{ required: 'Este campo es obligatorio' }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <InputTextarea className={classNames('w-full', { 'p-invalid': fieldState.invalid })} {...field} />
                    )}
                  />
                  <ErrorMessage name="motivoConsulta" />
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label>ENFERMEDADES O PROBLEMA ACTUAL: *</label>
                    <h6>CRONPLOGIA, LOCALIZACIÓN, CARACTERÍSTICAS, INTENSIDAD, CAUSA APARENTE, FACTORES QUE AGRAVAN O MEJORAN, SÍNTOMAS ASOCIADOS, EVOLUCIÓN, RESULTADOS DE EXÁMENES ANTERIORES</h6>
                    <Controller
                    name="enfermedades"
                    rules={{ required: 'Este campo es obligatorio' }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <InputTextarea className={classNames('w-full', { 'p-invalid': fieldState.invalid })} {...field} />
                    )}
                  />
                  <ErrorMessage name="enfermedades" />
                  <label>MEDICAMENTOS QUE INGIERE: *</label>
                  <Controller
                    name="medicamentos"
                    rules={{ required: 'Este campo es obligatorio' }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <InputTextarea className={classNames('w-full', { 'p-invalid': fieldState.invalid })} {...field} />
                    )}
                  />
                  <ErrorMessage name="medicamentos" />
                    <Controller
                      name="estadoGeneral"
                      rules={{
                        required: 'Es necesario seleccionar un tipo de estado general',
                      }}
                      render={({ field }) => (
                        <div className="d-flex flex-column">
                          <div className="d-inline-flex">
                            <label htmlFor="" className=" me-3">
                              ESTADO GENERAL: *
                            </label>
                            <label htmlFor="input-dependiente" className="mx-2">
                              DEPENDIENTE
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="USUARIO"
                              checked={field.value === 'DEPENDIENTE'}
                              id="input-dependiente"
                              onChange={() => field.onChange('DEPENDIENTE')}
                            />

                            <label className="ms-4 me-2" htmlFor="input-fragil">
                              FRÁGIL
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="FRÁGIL"
                              checked={field.value === 'FRÁGIL'}
                              id="input-cuidador"
                              onChange={() => field.onChange('FRÁGIL')}
                            />

                            <label className="ms-4 me-2" htmlFor="input-independiente">
                              INDEPENDIENTE
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="INDEPENDIENTE"
                              checked={field.value === 'INDEPENDIENTE'}
                              id="input-cuidador"
                              onChange={() => field.onChange('INDEPENDIENTE')}
                            />
                          </div>
                          <ErrorMessage name="estadoGeneral" />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label>3. REVISIÓN ACTUAL DE SISTEMAS: </label>
                    <h6>REDONDO= CON PATOLOGÍA: DESCRIBIR</h6>
                    <h6>CUADRADO= SIN PATOLOGÍA: NO DESCRIBIR</h6>
                    <Controller
                      name="sistemas"
                      render={({ field }) => (
                        <div className="d-flex flex-column">
                          <div className="d-inline-flex">
                            <label htmlFor="input-vision" className="mx-2">
                              1. VISIÓN
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                             <label htmlFor="input-audicion" className="mx-2">
                              2. AUDICIÓN
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-olfato-gusto" className="mx-2">
                              3. OLFATO Y GUSTO
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-respiratorio" className="mx-2">
                              4. RESPIRATORIO
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />

                          <label htmlFor="input-cardiovascular" className="mx-2">
                              5. CARDIOVASCULAR
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />

                            <label htmlFor="input-audicion" className="mx-2">
                              6. DIGESTIVO
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                          </div>
                          

                        </div>
                      )}
                    />
                    <Controller
                    name="observaciones"
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <InputTextarea className={classNames('w-full', { 'p-invalid': fieldState.invalid })} {...field} />
                    )}
                  />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label>4. ANTECEDENTES PERSONALES: </label>
                    <h6>REDONDO= CON PATOLOGÍA: DESCRIBIR</h6>
                    <h6>CUADRADO= SIN PATOLOGÍA: NO DESCRIBIR</h6>
                    <Controller
                      name="antecedentesPersonales"
                      render={({ field }) => (
                        <div className="d-flex flex-column">
                          <div className="d-inline-flex">
                          <label className="ms-4 me-2">
                              ALERTAS DE RIESGO
                          </label>
                          <label className="ms-4 me-2" htmlFor="input-caida">
                              1. CAÍDA
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-cuidador"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <label htmlFor="input-dismovilidad" className="mx-2">
                              2. DISMOVILIDAD
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <label htmlFor="input-peso" className="mx-2">
                              3. PÉRDIDA DE PESO
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <label htmlFor="input-astenia" className="mx-2">
                              4. ASTENIA
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <label htmlFor="input-desorientacion" className="mx-2">
                              5. DESORIENTACIÓN
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                          <label htmlFor="input-comportamiento" className="mx-2">
                              6. ALTERACIONES DEL COMPORTAMIENTO
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-vision"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                          </div>
                          

                        </div>
                      )}
                    />
                    <Controller
                    name="observaciones"
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <InputTextarea className={classNames('w-full', { 'p-invalid': fieldState.invalid })} {...field} />
                    )}
                  />
                  </div>
                </div>
              </div>
            </div>




            <div className="col-md-8 mt-3">
              <div className="row justify-content-around">
                <div className="col-md-4">
                  <Button label="Regresar" outlined block />
                </div>
                <div className="col-md-4">
                  <Button label="Guardar" outlined block type="submit" />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </PrivateLayout>
  );
};

FichaIngresoFormPage.getInitialProps = ({ query }) => query as any;

export default FichaIngresoFormPage;
