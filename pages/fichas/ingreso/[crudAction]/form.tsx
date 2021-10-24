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

                    <div className="w-100">
                      <CheckOptionsInlineCirculoCuadrado
                        label="CLÍNICO QUIRURGICOS"
                        options={[
                          {
                            labelText: '1. DERMATOLOGICOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.dermatologicos',
                            },
                          },
                          {
                            labelText: '2. VISUALES',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.visuales',
                            },
                          },
                          {
                            labelText: '3. OTORRINO',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.otorrino',
                            },
                          },
                          {
                            labelText: '4. ESTOMATOLOGICOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.estomatologicos',
                            },
                          },
                          {
                            labelText: '5. ENDOCRINOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.endocrinos',
                            },
                          },
                          {
                            labelText: '6. CARDIO VASCULARES',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.cardiovasculares',
                            },
                          },
                          {
                            labelText: '7. RESPIRATORIOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.respiratorios',
                            },
                          },
                          {
                            labelText: '8. DIGESTIVOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.digestivos',
                            },
                          },
                          {
                            labelText: '9. NEUROLOGICO',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.neurologico',
                            },
                          },
                          {
                            labelText: '10. UROLÓGICOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.urologico',
                            },
                          },
                          {
                            labelText: '11. HEMO LINFATICOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.hemolinfatico',
                            },
                          },
                          {
                            labelText: '12. INFECCIOSOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.infeccioso',
                            },
                          },
                          {
                            labelText: '13. TRONCOLOGICOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.troncologico',
                            },
                          },
                          {
                            labelText: '14. MUSCULO ESQUELETICOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.musculoesqueletico',
                            },
                          },
                          {
                            labelText: '15. PSIQUIATRICOS',
                            controller: {
                              name: 'antecedentesPersonales.clinicoquirurgicos.psiquiatrico',
                            },
                          },
                        ]}
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
                              name: 'antecedentesPersonales.ginecoobstetricos.edadmenopausia',
                            },
                          },
                          {
                            labelText: '2. EDAD DE ULTIMA MAMOGRAFIA',
                            controller: {
                              name: 'antecedentesPersonales.ginecoobstetricos.edadmamografia',
                            },
                          },
                          {
                            labelText: '3. EDAD DE ULTIMA CITOLOGIA',
                            controller: {
                              name: 'antecedentesPersonales.ginecoobstetricos.edadcitologia',
                            },
                            value: 'ADICCIONES',
                          },
                          {
                            labelText: '4. EMBARAZOS',
                            controller: {
                              name: 'antecedentesPersonales.ginecoobstetricos.embarazo',
                            },
                          },
                          {
                            labelText: '5. PARTOS',
                            controller: {
                              name: 'antecedentesPersonales.ginecoobstetricos.parto',
                            },
                          },
                          {
                            labelText: '6. CESAREAS',
                            controller: {
                              name: 'antecedentesPersonales.ginecoobstetricos.cesarea',
                            },
                          },
                          {
                            labelText: '7. TERAPIA HORMONAL',
                            controller: {
                              name: 'antecedentesPersonales.ginecoobstetricos.terapiahormonal',
                            },
                          },
                        ]}
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
                              name: 'antecedentesPersonales.andrologicos.antigenoprostatico',
                            },
                          },
                          {
                            labelText: '2. TERAPIA HORMONAL',
                            controller: {
                              name: 'antecedentesPersonales.andrologicos.terapiahormonal',
                            },
                          },
                        ]}
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
                              name: 'antecedentesPersonales.farmacologicos.aines',
                            },
                          },
                          {
                            labelText: '2. ANALGESICOS',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.analgesicos',
                            },
                          },
                          {
                            labelText: '3. ANTIDIABETICOS',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.antidiabeticos',
                            },
                          },
                          {
                            labelText: '4. ANTIHIPERTENSIVOS',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.antihipertensivos',
                            },
                          },
                          {
                            labelText: '5. ANTICOAGULANTES',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.anticoagulantes',
                            },
                          },
                          {
                            labelText: '6. PSICO FARMACOS',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.psicofarmacos',
                            },
                          },
                          {
                            labelText: '7. ANTIBIOTICOS',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.antibioticos',
                            },
                          },
                          {
                            labelText: '8. OTROS',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.otros',
                            },
                          },
                          {
                            labelText: '9. NUMERO DE PRESCRIPTORES',
                            controller: {
                              name: 'antecedentesPersonales.farmacologicos.numeroprescriptores',
                            },
                          },
                        ]}
                      />
                      <hr />
                    </div>

                    

                    
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
                              name: 'antecedentesPersonales.antecedentes.cardiopata',
                            },
                          },
                          {
                            labelText: '2. DIABETES',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.diabetes',
                            },
                          },
                          {
                            labelText: '3. HIPERTENSION ARTERIAL',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.hipertension arterial',
                            },
                          },
                          {
                            labelText: '4. NEOPLASIA',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.neoplasia',
                            },
                          },
                          {
                            labelText: '5. ALZHEIMER',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.alzheimer',
                            },
                          },
                          {
                            labelText: '6. PARKINSON',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.parkinson',
                            },
                          },
                          {
                            labelText: '7. TUBERCULOSIS',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.tuberculosis',
                            },
                          },
                          {
                            labelText: '8. VIOLENCIA INTRAFAMILIAR',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.violenciaintrafamiliar',
                            },
                          },
                          {
                            labelText: '9. SINDROME DEL CUIDADOR',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.sindromecuidador',
                            },
                          },
                          {
                            labelText: '10. OTROS',
                            controller: {
                              name: 'antecedentesPersonales.antecedentes.otros',
                            },
                          },
                        ]}
                      />
                      <hr />
                    </div>
                    
                  

                    

                    
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
                  <h4>9. PRUEBAS DIAGNÓSTICAS:</h4>
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
