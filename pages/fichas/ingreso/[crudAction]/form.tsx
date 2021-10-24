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
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
                    <label htmlFor="contenido.viveCon">VIVE CON: *</label>
                    <TextInput controller={{ name: 'contenido.viveCon' }} block />
                  </div>
                  <div className="my-2">
                    <label htmlFor="contenido.ocupacionAnterior">OCUPACIÓN ANTERIOR: *</label>
                    <TextInput controller={{ name: 'contenido.ocupacionAnterior' }} block />
                  </div>
                  <div className="my-2">
                    <label htmlFor="contenido.ocupacionActual">OCUPACIÓN ACTUAL: *</label>
                    <TextInput controller={{ name: 'contenido.ocupacionActual' }} block />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label htmlFor="contenido.motivoConsulta">MOTIVO DE CONSULTA: *</label>
                    <CheckOptionsInline
                      label="INFORMANTE: *"
                      controller={{
                        name: 'contenido.informante',
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
                      name: 'contenido.motivoConsulta',
                      defaultValue: '',
                      rules: { required: 'Este campo es obligatorio' },
                    }}
                  />

                  <ErrorMessage name="contenido.motivoConsulta" />
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="row justify-content-between">
                    <label className="col-12 md:col-6" htmlFor="contenido.enfermedades">
                      2. ENFERMEDADES O PROBLEMA ACTUAL: *
                    </label>
                    <h6 className="md:text-right col-12 md:col-6">
                      CRONOLOGÍA, LOCALIZACIÓN, CARACTERÍSTICAS, INTENSIDAD, CAUSA APARENTE, FACTORES QUE AGRAVAN O
                      MEJORAN, SÍNTOMAS ASOCIADOS, EVOLUCIÓN, RESULTADOS DE EXÁMENES ANTERIORES
                    </h6>
                  </div>
                  <div className="mb-3">
                    <TextArea
                      controller={{
                        name: 'contenido.enfermedades',
                        defaultValue: '',
                        rules: { required: 'Este campo es obligatorio' },
                      }}
                      block
                    />
                    <ErrorMessage name="contenido.enfermedades" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contenido.medicamentos">MEDICAMENTOS QUE INGIERE: *</label>
                    <TextArea
                      controller={{
                        name: 'contenido.medicamentos',
                        defaultValue: '',
                        rules: { required: 'Este campo es obligatorio' },
                      }}
                      block
                    />
                    <ErrorMessage name="contenido.medicamentos" />
                  </div>

                  <div className="d-flex flex-row flex-wrap">
                    <CheckOptionsInline
                      label="ESTADO GENERAL: *"
                      controller={{
                        name: 'contenido.estadoGeneral',
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
                            name: 'contenido.sistemas.vision',
                          },
                          valueCirculo: 'VISIÓN-PATOLOGIA',
                          valueCuadrado: 'VISIÓN-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '2. AUDICIÓN',
                          controller: {
                            name: 'contenido.sistemas.audicion',
                          },
                          valueCirculo: 'AUDICIÓN-PATOLOGIA',
                          valueCuadrado: 'AUDICIÓN-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '3. OLFATO Y GUSTO',
                          controller: {
                            name: 'contenido.sistemas.olfatoGusto',
                          },
                          valueCirculo: 'OLFATO Y GUSTO-PATOLOGIA',
                          valueCuadrado: 'OLFATO Y GUSTO-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '4. RESPIRATORIO',
                          controller: {
                            name: 'contenido.sistemas.respiratorio',
                          },
                          valueCirculo: 'RESPIRATORIO-PATOLOGIA',
                          valueCuadrado: 'RESPIRATORIO-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '5. CARDIOVASCULAR',
                          controller: {
                            name: 'contenido.sistemas.cardiovascular',
                          },
                          valueCirculo: 'CARDIOVASCULAR-PATOLOGIA',
                          valueCuadrado: 'CARDIOVASCULAR-SIN-PATOLOGIA',
                        },
                        {
                          labelText: '6. DIGESTIVO',
                          controller: {
                            name: 'contenido.sistemas.digestivo',
                          },
                          valueCirculo: 'DIGESTIVO-PATOLOGIA',
                          valueCuadrado: 'DIGESTIVO-SIN-PATOLOGIA',
                        },
                      ]}
                    />
                    <TextArea controller={{ name: 'contenido.sistemas.observaciones' }} block />
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
                              name: 'contenido.antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'CAÍDA',
                          },
                          {
                            labelText: '2. DISMOVILIDAD',
                            controller: {
                              name: 'contenido.antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'DISMOVILIDAD',
                          },
                          {
                            labelText: '3. PÉRDIDA DE PESO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'PÉRDIDA DE PESO',
                          },
                          {
                            labelText: '4. ASTENIA',
                            controller: {
                              name: 'contenido.antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'ASTENIA',
                          },
                          {
                            labelText: '5. DESORIENTACIÓN',
                            controller: {
                              name: 'contenido.antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'DESORIENTACIÓN',
                          },
                          {
                            labelText: '6. ALTERACIONES DEL COMPORTAMIENTO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.alertasRiesgo.caida',
                            },
                            value: 'ALTERACIONES DEL COMPORTAMIENTO',
                          },
                        ]}
                      />
                      <TextArea
                        controller={{ name: 'contenido.antecedentesPersonales.alertasRiesgo.observaciones' }}
                        block
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
                              name: 'contenido.antecedentesPersonales.generales.inmunizaciones',
                            },
                          },
                          {
                            labelText: '2. HIGIENE GENERAL',
                            controller: {
                              name: 'contenido.antecedentesPersonales.generales.higieneGeneral',
                            },
                          },
                          {
                            labelText: '3. HIGIENE ORAL',
                            controller: {
                              name: 'contenido.antecedentesPersonales.generales.higieneOral',
                            },
                          },
                          {
                            labelText: '4. EJERCICIO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.generales.ejercicio',
                            },
                          },
                          {
                            labelText: '5. ALIMENTACIÓN',
                            controller: {
                              name: 'contenido.antecedentesPersonales.generales.alimentacion',
                            },
                          },
                          {
                            labelText: '6. ACTIVIDAD RECREATIVA',
                            controller: {
                              name: 'contenido.antecedentesPersonales.generales.actividadRecreativa',
                            },
                          },
                          {
                            labelText: '8. ALERGIAS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.generales.alergias',
                            },
                          },
                          {
                            labelText: '9. OTROS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.generales.otros',
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
                              name: 'contenido.antecedentesPersonales.habitosNocivos.tabaquismo',
                            },
                            value: 'TABASQUISMO',
                          },
                          {
                            labelText: '2. ALCOHOLISMO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.habitosNocivos.alcoholismo',
                            },
                            value: 'ALCOHOLISMO',
                          },
                          {
                            labelText: '3. ADICCIONES',
                            controller: {
                              name: 'contenido.antecedentesPersonales.habitosNocivos.adicciones',
                            },
                            value: 'ADICCIONES',
                          },
                          {
                            labelText: '4. OTRO HABITO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.habitosNocivos.otro',
                            },
                            value: 'OTRO HABITO',
                          },
                        ]}
                      />
                      <TextArea
                        controller={{ name: 'contenido.antecedentesPersonales.habitosNocivos.observaciones' }}
                        block
                      />
                      <hr />
                    </div>

                    <div className="w-100">
                      <CheckOptionsInlineCirculoCuadrado
                        label="CLÍNICO QUIRURGICOS"
                        options={[
                          {
                            labelText: '1. DERMATOLOGICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.dermatologicos',
                            },
                          },
                          {
                            labelText: '2. VISUALES',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.visuales',
                            },
                          },
                          {
                            labelText: '3. OTORRINO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.otorrino',
                            },
                          },
                          {
                            labelText: '4. ESTOMATOLOGICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.estomatologicos',
                            },
                          },
                          {
                            labelText: '5. ENDOCRINOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.endocrinos',
                            },
                          },
                          {
                            labelText: '6. CARDIO VASCULARES',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.cardiovasculares',
                            },
                          },
                          {
                            labelText: '7. RESPIRATORIOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.respiratorios',
                            },
                          },
                          {
                            labelText: '8. DIGESTIVOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.digestivos',
                            },
                          },
                          {
                            labelText: '9. NEUROLOGICO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.neurologico',
                            },
                          },
                          {
                            labelText: '10. UROLÓGICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.urologico',
                            },
                          },
                          {
                            labelText: '11. HEMO LINFATICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.hemolinfatico',
                            },
                          },
                          {
                            labelText: '12. INFECCIOSOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.infeccioso',
                            },
                          },
                          {
                            labelText: '13. TRONCOLOGICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.troncologico',
                            },
                          },
                          {
                            labelText: '14. MUSCULO ESQUELETICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.musculoesqueletico',
                            },
                          },
                          {
                            labelText: '15. PSIQUIATRICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.clinicoquirurgicos.psiquiatrico',
                            },
                          },
                        ]}
                      />
                      <TextArea
                        controller={{ name: 'contenido.antecedentesPersonales.clinicoquirurgicos.observaciones' }}
                        block
                      />
                      <hr />
                    </div>

                    <div className="w-100">
                      <CheckOptionsMultipleInline
                        label="GINECO OBSTETRICOS"
                        options={[
                          {
                            labelText: '1. EDAD DE MENOPAUSIA',
                            controller: {
                              name: 'contenido.antecedentesPersonales.ginecoobstetricos.edadmenopausia',
                            },
                          },
                          {
                            labelText: '2. EDAD DE ULTIMA MAMOGRAFIA',
                            controller: {
                              name: 'contenido.antecedentesPersonales.ginecoobstetricos.edadmamografia',
                            },
                          },
                          {
                            labelText: '3. EDAD DE ULTIMA CITOLOGIA',
                            controller: {
                              name: 'contenido.antecedentesPersonales.ginecoobstetricos.edadcitologia',
                            },
                            value: 'ADICCIONES',
                          },
                          {
                            labelText: '4. EMBARAZOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.ginecoobstetricos.embarazo',
                            },
                          },
                          {
                            labelText: '5. PARTOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.ginecoobstetricos.parto',
                            },
                          },
                          {
                            labelText: '6. CESAREAS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.ginecoobstetricos.cesarea',
                            },
                          },
                          {
                            labelText: '7. TERAPIA HORMONAL',
                            controller: {
                              name: 'contenido.antecedentesPersonales.ginecoobstetricos.terapiahormonal',
                            },
                          },
                        ]}
                      />
                      <TextArea
                        controller={{ name: 'contenido.antecedentesPersonales.ginecoobstetricos.observaciones' }}
                        block
                      />
                      <hr />
                    </div>

                    <div className="w-100">
                      <CheckOptionsMultipleInline
                        label="ANDROLOGICOS"
                        options={[
                          {
                            labelText: '1. EDAD DE ULTIMO ANTIGENO PROSTATICO',
                            controller: {
                              name: 'contenido.antecedentesPersonales.andrologicos.antigenoprostatico',
                            },
                          },
                          {
                            labelText: '2. TERAPIA HORMONAL',
                            controller: {
                              name: 'contenido.antecedentesPersonales.andrologicos.terapiahormonal',
                            },
                          },
                        ]}
                      />
                      <TextArea
                        controller={{ name: 'contenido.antecedentesPersonales.andrologicos.observaciones' }}
                        block
                      />
                      <hr />
                    </div>

                    <div className="w-100">
                      <CheckOptionsMultipleInline
                        label="FARMACOLOGICOS"
                        options={[
                          {
                            labelText: '1. AINES',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.aines',
                            },
                          },
                          {
                            labelText: '2. ANALGESICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.analgesicos',
                            },
                          },
                          {
                            labelText: '3. ANTIDIABETICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.antidiabeticos',
                            },
                          },
                          {
                            labelText: '4. ANTIHIPERTENSIVOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.antihipertensivos',
                            },
                          },
                          {
                            labelText: '5. ANTICOAGULANTES',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.anticoagulantes',
                            },
                          },
                          {
                            labelText: '6. PSICO FARMACOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.psicofarmacos',
                            },
                          },
                          {
                            labelText: '7. ANTIBIOTICOS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.antibioticos',
                            },
                          },
                          {
                            labelText: '8. OTROS',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.otros',
                            },
                          },
                          {
                            labelText: '9. NUMERO DE PRESCRIPTORES',
                            controller: {
                              name: 'contenido.antecedentesPersonales.farmacologicos.numeroprescriptores',
                            },
                          },
                        ]}
                      />
                      <TextArea
                        controller={{ name: 'contenido.antecedentesPersonales.famarcologicos.observaciones' }}
                        block
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label className="my-1">5. ANTECEDENTES FAMILIARES Y SOCIALES: </label>
                    <div className="my-1">
                      <h6>REDONDO = CON PATOLOGÍA: DESCRIBIR</h6>
                      <h6>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</h6>
                    </div>

                    <div className="w-100">
                      <CheckOptionsInlineCirculoCuadrado
                        options={[
                          {
                            labelText: '1. CARDIOPATAS',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.cardiopata',
                            },
                          },
                          {
                            labelText: '2. DIABETES',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.diabetes',
                            },
                          },
                          {
                            labelText: '3. HIPERTENSION ARTERIAL',
                            controller: {
                              name: 'contenido.antecedentesPersonales.antecedentes.hipertension arterial',
                            },
                          },
                          {
                            labelText: '4. NEOPLASIA',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.neoplasia',
                            },
                          },
                          {
                            labelText: '5. ALZHEIMER',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.alzheimer',
                            },
                          },
                          {
                            labelText: '6. PARKINSON',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.parkinson',
                            },
                          },
                          {
                            labelText: '7. TUBERCULOSIS',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.tuberculosis',
                            },
                          },
                          {
                            labelText: '8. VIOLENCIA INTRAFAMILIAR',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.violenciaintrafamiliar',
                            },
                          },
                          {
                            labelText: '9. SINDROME DEL CUIDADOR',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.sindromecuidador',
                            },
                          },
                          {
                            labelText: '10. OTROS',
                            controller: {
                              name: 'contenido.antecedentesFamiliares.antecedentes.otros',
                            },
                          },
                        ]}
                      />
                      <TextArea
                        controller={{ name: 'contenido.antecedentesFamiliares.antecedentes.observaciones' }}
                        block
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <label className="my-1">6. SIGNOS VITALES, ANTROPOMETRIA Y TAMIZAJE: </label>
                  <div className="d-flex flex-row flex-wrap justify-content-around">
                    {/* P. ARTERIAL ACOSTADO */}
                    <div className="d-flex flex-column text-center">
                      <label
                        htmlFor="contenido.signosVitales.presionAterial.sentado.numerador"
                        style={{ maxWidth: '10rem' }}
                      >
                        P. ARTERIAL ACOSTADO
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.presionAterial.sentado.numerador"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.presionAterial.acostado.numerador' }}
                          />

                          <TextInput
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.presionAterial.acostado.denominador' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* P. ARTERIAL SENTADO */}
                    <div className="d-flex flex-column text-center">
                      <label
                        htmlFor="contenido.signosVitales.presionAterial.sentado.numerador"
                        style={{ maxWidth: '10rem' }}
                      >
                        P. ARTERIAL SENTADO
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.presionAterial.sentado.numerador"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.presionAterial.sentado.numerador' }}
                          />

                          <TextInput
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.presionAterial.sentado.denominador' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* TEMPERATURA C */}
                    <div className="d-flex flex-column text-center">
                      <label htmlFor="contenido.signosVitales.temperatura" style={{ maxWidth: '10rem' }}>
                        TEMPERATURA C
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.temperatura"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.temperatura' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* PULSO / mm */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.pulSo" style={{ maxWidth: '10rem' }}>
                        PULSO / mm
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.pulSo"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.pulSo' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* FRECUENCIA RESPIR. / mm */}
                    <div className="d-flex flex-column text-center ">
                      <label htmlFor="contenido.signosVitales.frecuencoaRespiratoria" style={{ maxWidth: '10rem' }}>
                        FRECUENCIA RESPIR. / mm
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.frecuencoaRespiratoria"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.frecuencoaRespiratoria' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex flex-row flex-wrap justify-content-around">
                    {/* PESO / kg */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.peso" style={{ maxWidth: '10rem' }}>
                        PESO / kg
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.peso"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.peso' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* TALLA cm */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.talla" style={{ maxWidth: '10rem' }}>
                        TALLA / cm
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.talla"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.talla' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* IMC */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.imc" style={{ maxWidth: '10rem' }}>
                        IMC
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.imc"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.imc' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* PERIMETRO CINTURA */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.perimetroCintura" style={{ maxWidth: '10rem' }}>
                        PERIMETRO CINTURA
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.perimetroCintura"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.perimetroCintura' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* PERIMETRO CADERA */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.perimetroCadera" style={{ maxWidth: '10rem' }}>
                        PERIMETRO CADERA
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.perimetroCadera"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.perimetroCadera' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* PERIMETRO PANTORRILLA */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.perimetroPantorrilla" style={{ maxWidth: '10rem' }}>
                        PERIMETRO PANTORRILLA
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.perimetroPantorrilla"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.perimetroPantorrilla' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* RESPONSABLE SIGLAS */}
                    <div className="d-flex flex-column text-center justify-content-between">
                      <label htmlFor="contenido.signosVitales.responsableSiglas" style={{ maxWidth: '10rem' }}>
                        RESPONSABLE SIGLAS
                      </label>
                      <div className="w-100">
                        <div className="p-inputgroup justify-content-center">
                          <TextInput
                            id="contenido.signosVitales.responsableSiglas"
                            className="text-center"
                            style={{ maxWidth: '6rem' }}
                            controller={{ name: 'contenido.signosVitales.responsableSiglas' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* FIN row */}
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <div className="d-flex flex-row flex-wrap justify-content-between">
                    <label className="my-1">7. EXAMEN FÍSICO: </label>
                    <div className="my-1">
                      <h6>REDONDO = CON PATOLOGÍA: DESCRIBIRCON EL NUMERO</h6>
                      <h6>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</h6>
                    </div>

                    <div className="w-100">
                      <CheckOptionsInlineCirculoCuadrado
                        label="REGIONAL (1-14)"
                        options={[
                          {
                            labelText: '1. PIEL',
                            controller: {
                              name: 'contenido.examenFisico.regional.piel',
                            },
                          },
                          {
                            labelText: '2. CABEZA',
                            controller: {
                              name: 'contenido.examenFisico.regional.cabeza',
                            },
                          },
                          {
                            labelText: '3. OJOS',
                            controller: {
                              name: 'contenido.examenFisico.regional.ojos',
                            },
                          },
                          {
                            labelText: '4. OÍDOS',
                            controller: {
                              name: 'contenido.examenFisico.regional.oidos',
                            },
                          },
                          {
                            labelText: '5. BOCA',
                            controller: {
                              name: 'contenido.examenFisico.regional.boca',
                            },
                          },
                          {
                            labelText: '6. NARIZ',
                            controller: {
                              name: 'contenido.examenFisico.regional.nariz',
                            },
                          },
                          {
                            labelText: '7. CUELLO',
                            controller: {
                              name: 'contenido.examenFisico.regional.cuello',
                            },
                          },
                          {
                            labelText: '8. AXILA-MAMA',
                            controller: {
                              name: 'contenido.examenFisico.regional.axilamama',
                            },
                          },
                          {
                            labelText: '9. TORAX',
                            controller: {
                              name: 'contenido.examenFisico.regional.torax',
                            },
                          },
                          {
                            labelText: '10. ABDOMEN',
                            controller: {
                              name: 'contenido.examenFisico.regional.abdomen',
                            },
                          },
                          {
                            labelText: '11. COLUMNA',
                            controller: {
                              name: 'contenido.examenFisico.regional.columna',
                            },
                          },
                          {
                            labelText: '12. PERINÉ',
                            controller: {
                              name: 'contenido.examenFisico.regional.perine',
                            },
                          },
                          {
                            labelText: '13. M. SUPERIORES',
                            controller: {
                              name: 'contenido.examenFisico.regional.msuperiores',
                            },
                          },
                          {
                            labelText: '14. M. INFERIORES',
                            controller: {
                              name: 'contenido.examenFisico.regional.minferiores',
                            },
                          },
                        ]}
                      />

                      <TextArea
                        controller={{ name: 'contenido.antecedentesFamiliares.antecedentes.observaciones' }}
                        block
                      />
                      <hr />
                    </div>

                    <div className="w-100">
                      <CheckOptionsInlineCirculoCuadrado
                        label="SISTEMATICO (1-9)"
                        options={[
                          {
                            labelText: '1. ORG DE LOS SENTIDOS',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.orgsentidos',
                            },
                          },
                          {
                            labelText: '2. RESPIRATORIO',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.respiratorio',
                            },
                          },
                          {
                            labelText: '3. CARDIO VASCULAR',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.cardiovascular',
                            },
                          },
                          {
                            labelText: '4. DIGESTIVO',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.digestivo',
                            },
                          },
                          {
                            labelText: '5. DENITO URINARIO',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.denitourinario',
                            },
                          },
                          {
                            labelText: '6. MUSCULO ESQUELETICO',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.musculoesqueletico',
                            },
                          },
                          {
                            labelText: '7. ENDOCRINO',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.endocrino',
                            },
                          },
                          {
                            labelText: '8. HEMO LINFATICO',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.hemolinfatico',
                            },
                          },
                          {
                            labelText: '9. NEUROLÓGICO',
                            controller: {
                              name: 'contenido.examenFisico.sistematico.neurologico',
                            },
                          },
                        ]}
                      />
                      <TextArea controller={{ name: 'contenido.examenFisico.observaciones' }} block />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <h4>9. PRUEBAS DIAGNÓSTICAS:</h4>
                  <h6>REGISTRAR LOS EXÁMENES DE LABORATORIO Y ESPECIALES SOLICITADOS</h6>
                  <div>
                    <TextArea controller={{ name: 'contenido.pruebasDiagnosticas.observaciones' }} block />
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center my-3">
              <div className="col-11 border">
                <div className="d-flex flex-column m-3">
                  <h4>10. DIAGNÓSTICO:</h4>
                  <h6>1.FUNCIONAL, 2.NUTRICIONAL, 3.PSICOLÓGICO, 4.SOCIAL, 5.EDUCATIVO, 6.FARMACOLÓGICO</h6>
                  <div>
                    <TextArea controller={{ name: 'contenido.diagnostico.observaciones' }} block />
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
