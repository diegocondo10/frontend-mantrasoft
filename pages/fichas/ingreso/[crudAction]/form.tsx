import Button from '@src/components/Button';
import CheckOptionsInline from '@src/components/Forms/CheckOptionsInline';
import CheckOptionsInlineCirculoCuadrado from '@src/components/Forms/CheckOptionsInlineCirculoCuadrado';
import CheckOptionsMultipleInline from '@src/components/Forms/CheckOptionsMultipleInline';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoForm } from '@src/services/urls';
import classNames from 'classnames';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
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

              <DropDown
                controller={{ name: 'paciente' }}
                options={queryCatalogo?.data?.data?.pacientes || []}
                block
                showClear
              />

              <ErrorMessage name="paciente" />
            </div>

            <div className="md:col-8 lg:col-5">
              <label htmlFor="paciente" className="w-full">
                Buscar Habitación: *
              </label>

              <DropDown
                controller={{ name: 'paciente' }}
                options={queryCatalogo?.data?.data?.habitaciones || []}
                block
                showClear
                optionLabel="label"
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionGroupTemplate={(option) => (
                  <div className="d-flex flex-column">
                    <div>{option.label}</div>
                    <div className="ms-1">Habitaciones:</div>
                  </div>
                )}
              />
              <ErrorMessage name="habitacion" />
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <h3>INFORMACIÓN GENERAL</h3>
                  <div className="my-2">
                    <label htmlFor="viveCon">VIVE CON: *</label>
                    <TextInput controller={{ name: 'viveCon' }} block />
                  </div>
                  <div className="my-2">
                    <label htmlFor="ocupacionAnterior">OCUPACIÓN ANTERIOR: *</label>
                    <TextInput controller={{ name: 'ocupacionAnterior' }} block />
                  </div>
                  <div className="my-2">
                    <label htmlFor="ocupacionActual">OCUPACIÓN ACTUAL: *</label>
                    <TextInput controller={{ name: 'ocupacionActual' }} block />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label htmlFor="motivoConsulta">MOTIVO DE CONSULTA: *</label>
                    <CheckOptionsInline
                      label="INFORMANTE: *"
                      controller={{
                        name: 'informante',
                        rules: { required: 'Este campo es obligatorio' },
                      }}
                      options={[
                        {
                          labelText: 'USUARIO',
                          value: 'USUARIO',
                        },
                        {
                          labelText: 'CUIDADOR',
                          value: 'CUIDADOR',
                        },
                      ]}
                    />
                  </div>

                  <TextArea
                    controller={{
                      name: 'motivoConsulta',
                      defaultValue: '',
                      rules: { required: 'Este campo es obligatorio' },
                    }}
                  />

                  <ErrorMessage name="motivoConsulta" />
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="row justify-content-between">
                    <label className="col-12 md:col-6">2. ENFERMEDADES O PROBLEMA ACTUAL: *</label>
                    <h6 className="md:text-right col-12 md:col-6">
                      CRONOLOGÍA, LOCALIZACIÓN, CARACTERÍSTICAS, INTENSIDAD, CAUSA APARENTE, FACTORES QUE AGRAVAN O
                      MEJORAN, SÍNTOMAS ASOCIADOS, EVOLUCIÓN, RESULTADOS DE EXÁMENES ANTERIORES
                    </h6>
                  </div>
                  <div className="mb-3">
                    <TextArea
                      controller={{
                        name: 'enfermedades',
                        defaultValue: '',
                        rules: { required: 'Este campo es obligatorio' },
                      }}
                      block
                    />
                    <ErrorMessage name="enfermedades" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="medicamentos">MEDICAMENTOS QUE INGIERE: *</label>
                    <TextArea
                      controller={{
                        name: 'medicamentos',
                        defaultValue: '',
                        rules: { required: 'Este campo es obligatorio' },
                      }}
                      block
                    />
                    <ErrorMessage name="medicamentos" />
                  </div>

                  <div className="d-flex flex-row flex-wrap">
                    <CheckOptionsInline
                      label="ESTADO GENERAL: *"
                      controller={{
                        name: 'estadoGeneral',
                        rules: { required: 'Es necesario seleccionar un tipo de estado general' },
                      }}
                      options={[
                        {
                          labelText: 'DEPENDIENTE',
                          value: 'DEPENDIENTE',
                        },
                        {
                          labelText: 'FRÁGIL',
                          value: 'FRÁGIL',
                        },
                        {
                          labelText: 'INDEPENDIENTE',
                          value: 'INDEPENDIENTE',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label className="my-1">3. REVISIÓN ACTUAL DE SISTEMAS: </label>
                    <div className="my-1">
                      <h6>REDONDO = CON PATOLOGÍA: DESCRIBIR</h6>
                      <h6>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</h6>
                    </div>
                    <CheckOptionsInlineCirculoCuadrado
                      options={[
                        {
                          labelText: '1. VISIÓN',
                          controller: {
                            name: 'sistemas.vision',
                          },
                          valueCirculo: 'VISIÓN-PATOLOGIA',
                          valueCuadrado: 'VISIÓN-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '2. AUDICIÓN',
                          controller: {
                            name: 'sistemas.audicion',
                          },
                          valueCirculo: 'AUDICIÓN-PATOLOGIA',
                          valueCuadrado: 'AUDICIÓN-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '3. OLFATO Y GUSTO',
                          controller: {
                            name: 'sistemas.olfatoGusto',
                          },
                          valueCirculo: 'OLFATO Y GUSTO-PATOLOGIA',
                          valueCuadrado: 'OLFATO Y GUSTO-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '4. RESPIRATORIO',
                          controller: {
                            name: 'sistemas.respiratorio',
                          },
                          valueCirculo: 'RESPIRATORIO-PATOLOGIA',
                          valueCuadrado: 'RESPIRATORIO-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '5. CARDIOVASCULAR',
                          controller: {
                            name: 'sistemas.cardiovascular',
                          },
                          valueCirculo: 'CARDIOVASCULAR-PATOLOGIA',
                          valueCuadrado: 'CARDIOVASCULAR-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '6. DIGESTIVO',
                          controller: {
                            name: 'sistemas.digestivo',
                          },
                          valueCirculo: 'DIGESTIVO-PATOLOGIA',
                          valueCuadrado: 'DIGESTIVO-SIN-PATOLOGIA',
                        },
                      ]}
                    />
                    <TextArea controller={{ name: 'sistemas.observaciones' }} block />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label className="my-1">4. ANTECEDENTES PERSONALES: </label>
                    <div className="my-1">
                      <h6>REDONDO = CON PATOLOGÍA: DESCRIBIR</h6>
                      <h6>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</h6>
                    </div>
                    <div className="w-100">
                      <CheckOptionsMultipleInline
                        label="ALERTAS DE RIESGO"
                        options={[
                          {
                            labelText: '1. CAÍDA',
                            controller: {
                              name: 'antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'CAÍDA',
                          },
                          {
                            labelText: '2. DISMOVILIDAD',
                            controller: {
                              name: 'antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'DISMOVILIDAD',
                          },
                          {
                            labelText: '3. PÉRDIDA DE PESO',
                            controller: {
                              name: 'antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'PÉRDIDA DE PESO',
                          },
                          {
                            labelText: '4. ASTENIA',
                            controller: {
                              name: 'antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'ASTENIA',
                          },
                          {
                            labelText: '5. DESORIENTACIÓN',
                            controller: {
                              name: 'antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'DESORIENTACIÓN',
                          },
                          {
                            labelText: '6. ALTERACIONES DEL COMPORTAMIENTO',
                            controller: {
                              name: 'antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'ALTERACIONES DEL COMPORTAMIENTO',
                          },
                        ]}
                      />
                      <hr />
                    </div>
                    <div className="w-100">
                      <CheckOptionsInlineCirculoCuadrado
                        label="GENERALES"
                        options={[
                          {
                            labelText: '1. INMUNIZACIONES',
                            controller: {
                              name: 'antecedentesPersonales.generales.inmunizaciones',
                            },
                          },
                          {
                            labelText: '2. HIGIENE GENERAL',
                            controller: {
                              name: 'antecedentesPersonales.generales.higieneGeneral',
                            },
                          },
                          {
                            labelText: '3. HIGIENE ORAL',
                            controller: {
                              name: 'antecedentesPersonales.generales.higieneOral',
                            },
                          },
                          {
                            labelText: '4. EJERCICIO',
                            controller: {
                              name: 'antecedentesPersonales.generales.ejercicio',
                            },
                          },
                          {
                            labelText: '5. ALIMENTACIÓN',
                            controller: {
                              name: 'antecedentesPersonales.generales.alimentacion',
                            },
                          },
                          {
                            labelText: '6. ACTIVIDAD RECREATIVA',
                            controller: {
                              name: 'antecedentesPersonales.generales.actividadRecreativa',
                            },
                          },
                          {
                            labelText: '8. ALERGIAS',
                            controller: {
                              name: 'antecedentesPersonales.generales.alergias',
                            },
                          },
                          {
                            labelText: '9. OTROS',
                            controller: {
                              name: 'antecedentesPersonales.generales.otros',
                            },
                          },
                        ]}
                      />
                      <hr />
                    </div>

                    <div className="w-100">
                      <CheckOptionsMultipleInline
                        label="HABITOS NOCIVOS"
                        options={[
                          {
                            labelText: '1. TABASQUISMO',
                            controller: {
                              name: 'antecedentesPersonales.habitosNocivos.tabaquismo',
                            },
                            value: 'TABASQUISMO',
                          },
                          {
                            labelText: '2. ALCOHOLISMO',
                            controller: {
                              name: 'antecedentesPersonales.habitosNocivos.alcoholismo',
                            },
                            value: 'ALCOHOLISMO',
                          },
                          {
                            labelText: '3. ADICCIONES',
                            controller: {
                              name: 'antecedentesPersonales.habitosNocivos.adicciones',
                            },
                            value: 'ADICCIONES',
                          },
                          {
                            labelText: '4. OTRO HABITO',
                            controller: {
                              name: 'antecedentesPersonales.habitosNocivos.otro',
                            },
                            value: 'OTRO HABITO',
                          },
                        ]}
                      />
                      <hr />
                    </div>

                    <Controller
                      name="antecedentesPersonales"
                      render={({ field }) => (
                        <div className="d-flex flex-column">
                          <div className="d-inline-flex">
                            <label className="ms-4 me-2">CLINICO QUIRURGICOS</label>
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
                            <label className="ms-4 me-2">GINEO OBSTETRICOS</label>
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
                            <label className="ms-4 me-2">ANDROLOGICOS</label>
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
                            <label className="ms-4 me-2">FARMACOLÓGICOS</label>
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
                      render={({ field }) => <InputTextarea className={classNames('w-full')} {...field} />}
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
