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
                    <label>2. ENFERMEDADES O PROBLEMA ACTUAL: *</label>
                    <h6>CRONOLOGÍA, LOCALIZACIÓN, CARACTERÍSTICAS, INTENSIDAD, CAUSA APARENTE, FACTORES QUE AGRAVAN O MEJORAN, SÍNTOMAS ASOCIADOS, EVOLUCIÓN, RESULTADOS DE EXÁMENES ANTERIORES</h6>
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
                              id="input-audicion"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-audicion"
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
                              id="input-olfato-gusto"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-olfato-gusto"
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
                              id="input-respiratorio"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-respiratorio"
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
                              id="input-cardiovascular"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-cardiovascular"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />

                            <label htmlFor="input-digestivo" className="mx-2">
                              6. DIGESTIVO
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-digestivo"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-digestivo"
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
                              id="input-caida"
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
                              id="input-dismovilidad"
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
                              id="input-peso"
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
                              id="input-astenia"
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
                              id="input-desorientacion"
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
                              id="input-comportamiento"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />

                            <label className="ms-4 me-2">
                              GENERALES
                            </label>
                              <label className="ms-4 me-2" htmlFor="input-inmunizacion">
                              1. INMUNIZACIONES
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-inmunizacion"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-inmunizacion"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-higiene-general">
                              2. HIGIENE GENERAL
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-higiene-general"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-higiene-general"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                              <label className="ms-4 me-2" htmlFor="input-higiene-oral">
                              3. HIGIENE ORAL
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-higiene-oral"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-higiene-oral"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-ejercicio">
                              4. EJERCICIO
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-ejercicio"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-ejercicio"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-alimentación">
                              5. ALIMENTACIÓN
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-alimentacion"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-alimentacion"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-actividad-recreativa">
                              6. ACTIVIDAD RECREATIVA
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-actividad-recreativa"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-actividad-recreativa"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-controles-salud">
                              7. CONTROLES DE SALUD
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-controles-salud"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-controles-salud"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-alergias">
                              8. ALERGIAS
                            </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-alergias"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-alergias"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-otros">
                              9. OTROS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-otros"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-otros"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2">
                              HABITOS NOCIVOS
                            </label>
                              <label className="ms-4 me-2" htmlFor="input-inmunizacion">
                              1. TABASQUISMO
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-inmunizacion"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                            <label className="ms-4 me-2" htmlFor="input-higiene-general">
                              2. ALCOHOLISMO
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-higiene-general"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <label className="ms-4 me-2" htmlFor="input-higiene-oral">
                              3. ADICCIONES
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-higiene-oral"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                            <label className="ms-4 me-2" htmlFor="input-ejercicio">
                              4. OTRO HABITO
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-ejercicio"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />

                            <label className="ms-4 me-2">
                             CLINICO QUIRURGICOS
                              </label>
                              <label className="ms-4 me-2" htmlFor="input-dermatologico">
                              1. DERMATOLÓGICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-dermatologico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-dermatologico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-visual">
                              2. DERMATOLÓGICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-visual"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-visual"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-otorrino">
                              3. OTORRINO
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-otorrino"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-otorrino"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-estomatologico">
                              4. ESTOMATOLOGICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-estomatologico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-estomatologico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-endocrino">
                              5. ENDOCRINOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-endocrino"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-endocrino"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-cardiovasculares">
                              6. CARDIOVASCULARES
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-cardiovasculares"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-cardiovasculares"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-respiratorios">
                              7. RESPIRATORIOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-respiratorios"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-respiratorios"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-digestivos">
                              8. DIGESTIVOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-digestivos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-digestivos"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-neurológico">
                              9. NEUROLÓGICO
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-neurologico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-neurologico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-urologico">
                              10. UROLOGICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-urologico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-urologico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-hemolinfatico">
                              11. HEMO LINFÁTICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-hemolinfatico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-hemolinfatico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-infeccioso">
                              12. INFECCIOSOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-infecccioso"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-infeccioso"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-troncologico">
                              13. TRONCOLOGICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-troncologico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-troncologico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-musculo-esqueletico">
                              14. MUSCULO ESQUELÉTICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-musculo-esqueletico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-musculo-esqueletico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2" htmlFor="input-psiquiatrico">
                              15. PSIQUIÁTRICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-psiquiatrico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-psiquiatrico"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label className="ms-4 me-2">
                              GINEO OBSTETRICOS
                              </label>
                              <label className="ms-4 me-2" htmlFor="input-menopausia">
                              1. EDAD DE MENOPAUSIA
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-menopausia"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <label htmlFor="input-mamografia" className="mx-2">
                              2. EDAD DE ÚLTIMA MONOGRAFÍA
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-mamografia"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                             <label htmlFor="input-citologia" className="mx-2">
                              3. EDAD DE ÚLTIMA CITOLOGIA
                             </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-citologia"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <label htmlFor="input-embarazos" className="mx-2">
                              4. EMBARAZOS
                             </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-embarazos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                             />
                              <label htmlFor="input-partos" className="mx-2">
                              5. PARTOS
                              </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-partos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <label htmlFor="input-cesarea" className="mx-2">
                              6. CESÁREAS
                             </label>
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-cesarea"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <label htmlFor="input-terapia-hormonal" className="mx-2">
                              6. TERAPIA HORMONAL
                             </label>
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-terapia-hormonal"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                            <label className="ms-4 me-2">
                              ANDROLOGICOS
                              </label>
                              <label className="ms-4 me-2" htmlFor="input-antigeno-prostatico">
                              1. EDAD DE ÚLTIMO ANTÍGENO PROSTÁTICO
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-antigeno-prostatico"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <label htmlFor="input-terapia-hormonal-ult" className="mx-2">
                              2. TERAPIA HORMONAL
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-terapia-hormonal-ult"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <label className="ms-4 me-2">
                              FARMACOLÓGICOS
                              </label>
                              <label className="ms-4 me-2" htmlFor="input-aines">
                              1. AINES
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-aines"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                              <label htmlFor="input-analgesicos" className="mx-2">
                              2. ANALGÉSICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-analgesicos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                               <label htmlFor="input-antidiabeticos" className="mx-2">
                              3. ANTIDIABETICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-antidiabeticos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                               <label htmlFor="input-antihipertensivos" className="mx-2">
                              4. ANTIHIPERTENSIVOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-antihipertensivos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                               <label htmlFor="input-anticoagulantes" className="mx-2">
                              5. ANTICOAGULANTES
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-anticoagulantes"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                               <label htmlFor="input-psicofarmacos" className="mx-2">
                              6. PSICOFARMACOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-psicofarmacos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                               <label htmlFor="input-antibioticos" className="mx-2">
                              7. ANTIBIOTICOS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-antibioticos"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                               <label htmlFor="input-otros-ult" className="mx-2">
                              8. OTROS
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-otros-ult"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                               <label htmlFor="input-numero-prescriptores" className="mx-2">
                              9. NÚMERO DE PRESCRIPTORES
                              </label>
                              <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-numero-prescriptores"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                              />
                          </div>
                        </div>
                      )}
                    />
                    <Controller
                    name="observaciones"
                    defaultValue=""
                    render={({ field }) => (
                      <InputTextarea className={classNames('w-full')} {...field} />
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
                    <label>5. ANTECEDENTES FAMILIARES Y SOCIALES: </label>
                    <h6>CIRCULO= CON PATOLOGIA: DESCRIBIR ANOTANDO EL NÚMERO</h6>
                    <h6>CUADRADO= SIN PATOLOGIA: NO DESCRIBIR</h6>
                  
                    <Controller
                      name="antecedentes-familiares-sociales"
                      render={({ field }) => (
                        <div className="d-flex flex-column">
                          <div className="d-inline-flex">
                            <label htmlFor="input-cardiopatias" className="mx-2">
                              1. CARDIOPATIAS
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-cardipatias"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-cardipatias"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-diabetes" className="mx-2">
                              2. DIABETES
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-diabetes"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-diabetes"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-hipertension-arterial" className="mx-2">
                              3. HIPERTENSIÓN ARTERIAL
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-hipertension-arterial"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-hipertension-arterial"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-neoplasia" className="mx-2">
                              4. NEOPLASIA
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-neoplasia"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-neoplasia"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-alzheimer" className="mx-2">
                              5. ALZHEIMER
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-alzheimer"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-alzheimer"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-parkinson" className="mx-2">
                              6. PARKINSON
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-parkinson"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-parkinson"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-tuberculosis" className="mx-2">
                              7. TUBERCULOSIS
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-tuberculosis"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-tuberculosis"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-intrafamiliar" className="mx-2">
                              8. VIOLENCIA INTRAFAMILIAR
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-infrafamiliar"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-intrafamiliar"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-sindrome-cuidador" className="mx-2">
                              9. SÍNDORME DEL CUIDADOR
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-sindrome-cuidador"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-sindrome-cuidador"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                            <label htmlFor="input-otros-ult1" className="mx-2">
                              10. OTROS
                            </label>
                            <input
                              className="align-self-center"
                              type="checkbox"
                              value="CON PATOLOGIA"
                              checked={field.value === 'CON PATOLOGIA'}
                              id="input-otros-ult1"
                              onChange={() => field.onChange('CON PATOLOGIA')}
                            />
                             <input
                              className="align-self-center"
                              type="checkbox"
                              value="SIN PATOLOGIA"
                              checked={field.value === 'SIN PATOLOGIA'}
                              id="input-otros-ult1"
                              onChange={() => field.onChange('SIN PATOLOGIA')}
                            />
                          </div>
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
                  <h4>9. PRUBAS DIAGNÓSTICAS:</h4>
                  <h6>REGISTRAR LOS EXÁMENES DE LABORATORIO Y ESPECIALES SOLICITADOS</h6>
                  <div>
                    <InputText className="w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <h4>10. DIAGNÓSTICO:</h4>
                  <h6>1.FUNCIONAL, 2.NUTRICIONAL,3.PSICOLÓGICO,4.SOCIAL,5.EDUCATIVO, 6.FARMACOLÓGICO</h6>
                  <div>
                    <InputText className="w-full" />
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
