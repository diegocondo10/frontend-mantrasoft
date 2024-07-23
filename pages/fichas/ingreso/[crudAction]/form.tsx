import FloatingButton from '@src/components/FloatingButton';
import CheckOptionsInline from '@src/components/Forms/CheckOptionsInline';
import CheckOptionsInlineCirculoCuadrado from '@src/components/Forms/CheckOptionsInlineCirculoCuadrado';
import CheckOptionsMultipleInline from '@src/components/Forms/CheckOptionsMultipleInline';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import { REQUIRED_RULE } from '@src/constants/rules';
import Diagnosticos from '@src/containers/fichas/ingreso/form/Diagnosticos';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import {
  urlCatalogoForm,
  urlCreateFichasIngreso,
  urlDetailFichasIngreso,
  urlUpdateFichasIngreso,
} from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FichaIngresoFormPage: CustomNextPage<{ id: string | number; crudAction: CrudActions }> = ({ id, crudAction }) => {
  const methods = useForm({ mode: 'onChange' });

  const queryCatalogo = useQuery<any>(['pacientes-ficha-catalogo'], () => API.private().get<any>(urlCatalogoForm));
  useQuery<any>(['pacientes-ficha', id], () => API.private().get<any>(urlDetailFichasIngreso(id)), {
    enabled: id !== undefined && crudAction === CrudActions.UPDATE,
    onSuccess: ({ data }) => {
      console.log(data);
      methods.reset(data);
    },
    refetchOnWindowFocus: false,
  });

  const method = useMemo(
    () => ({
      create: 'post',
      editar: 'put',
    }),
    [],
  );

  const url = useMemo(
    () => ({
      create: urlCreateFichasIngreso,
      editar: urlUpdateFichasIngreso(id),
    }),
    [],
  );

  const mutation = useMutation((formData) => API.private()[method[crudAction]](url[crudAction], formData));

  const onSubmit = async (formData) => {
    try {
      await mutation.mutateAsync(formData);
      console.log(formData);
      router.push('/fichas/ingreso');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <PrivateLayout
        title="Ficha ingreso"
        breadCrumbItems={[
          {
            label: 'Fichas de ingreso',
            command: commandPush('/fichas/ingreso'),
          },
          {
            label: 'Formulario de ficha de ingreso',
          },
        ]}
      >
        <main className="grid grid-nogutter justify-content-center mb-8">
          <div className="col-11">
            <h1 className="text-center my-4">Ficha Ingreso</h1>
          </div>

          <form className="grid grid-nogutter justify-content-center" onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 my-3">
              <div className="formgrid grid justify-content-around">
                <h2 className="col-12 text-center">Información del paciente</h2>
                <div className="field col lg:col-6">
                  <label htmlFor="paciente" className="w-full font-bold">
                    Buscar paciente: *
                  </label>

                  <DropDown
                    controller={{ name: 'paciente', rules: { ...REQUIRED_RULE } }}
                    options={queryCatalogo?.data?.data?.pacientes || []}
                    block
                    filter
                    filterMatchMode="contains"
                    disabled={crudAction === CrudActions.UPDATE}
                  />

                  <ErrorMessage name="paciente" />
                </div>
                <div className="field col lg:col-5">
                  <label htmlFor="paciente" className="w-full font-bold">
                    Buscar Habitación: *
                  </label>
                  <DropDown
                    controller={{ name: 'habitacion', rules: { ...REQUIRED_RULE } }}
                    options={queryCatalogo?.data?.data?.habitaciones || []}
                    block
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    filter
                    filterMatchMode="contains"
                    optionGroupTemplate={(option) => (
                      <div className="flex flex-column">
                        <div>{option.label}</div>
                        <div className="ms-1">Habitaciones:</div>
                      </div>
                    )}
                  />
                  <ErrorMessage name="habitacion" />
                </div>
              </div>
            </div>

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 my-3">
              <div className="formgrid grid">
                <h3 className="col-12 text-center">INFORMACIÓN GENERAL</h3>
                <div className="field col-12 lg:col-6">
                  <label htmlFor="contenido.viveCon">VIVE CON: *</label>
                  <TextInput controller={{ name: 'contenido.viveCon', rules: { ...REQUIRED_RULE } }} block />
                  <ErrorMessage name="contenido.viveCon" />
                </div>
                <div className="field col-12 lg:col-6">
                  <label htmlFor="contenido.ocupacionAnterior">OCUPACIÓN ANTERIOR: *</label>
                  <TextInput
                    controller={{
                      name: 'contenido.ocupacionAnterior',
                      rules: { ...REQUIRED_RULE },
                    }}
                    block
                  />
                  <ErrorMessage name="contenido.ocupacionAnterior" />
                </div>

                <div className="field col-12 lg:col-6">
                  <label htmlFor="contenido.ocupacionActual">OCUPACIÓN ACTUAL: *</label>
                  <TextInput
                    controller={{
                      name: 'contenido.ocupacionActual',
                      rules: { ...REQUIRED_RULE },
                    }}
                    block
                  />
                  <ErrorMessage name="contenido.ocupacionActual" />
                </div>
              </div>
              <div className="flex flex-column">
                <div className="w-full my-3">
                  <CheckOptionsInline
                    label="INFORMANTE: *"
                    controller={{
                      name: 'contenido.informante',
                      rules: { ...REQUIRED_RULE },
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
                <label htmlFor="contenido.motivoConsulta">MOTIVO DE CONSULTA: *</label>
                <TextArea
                  controller={{
                    name: 'contenido.motivoConsulta',
                    defaultValue: '',
                    rules: { ...REQUIRED_RULE },
                  }}
                  rows={4}
                />

                <ErrorMessage name="contenido.motivoConsulta" />
              </div>
            </div>

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 my-3">
              <div className="flex flex-column">
                <div className="grid justify-content-between my-3">
                  <label className="col-12 font-bold md:col-6 align-self-center" htmlFor="contenido.enfermedades">
                    2. ENFERMEDADES O PROBLEMA ACTUAL: *
                  </label>
                  <p className="text-justify col-12 md:col-6">
                    CRONOLOGÍA, LOCALIZACIÓN, CARACTERÍSTICAS, INTENSIDAD, CAUSA APARENTE, FACTORES QUE AGRAVAN O
                    MEJORAN, SÍNTOMAS ASOCIADOS, EVOLUCIÓN, RESULTADOS DE EXÁMENES ANTERIORES
                  </p>
                </div>
                <div className="mb-3">
                  <TextArea
                    block
                    controller={{
                      name: 'contenido.enfermedades',
                      defaultValue: '',
                      rules: { ...REQUIRED_RULE },
                    }}
                  />
                  <ErrorMessage name="contenido.enfermedades" />
                </div>

                <div className="my-3">
                  <label htmlFor="contenido.medicamentos">MEDICAMENTOS QUE INGIERE: *</label>
                  <TextArea
                    controller={{
                      name: 'contenido.medicamentos',
                      defaultValue: '',
                      rules: { ...REQUIRED_RULE },
                    }}
                    rows={5}
                    autoResize
                    block
                  />
                  <ErrorMessage name="contenido.medicamentos" />
                </div>

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

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 my-3">
              <div className="flex flex-row flex-wrap justify-content-between">
                <h3 className="my-1 align-self-center">3. REVISIÓN ACTUAL DE SISTEMAS: </h3>
                <div className="my-1">
                  <p>REDONDO = CON PATOLOGÍA: DESCRIBIR</p>
                  <p>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</p>
                </div>
                <div className="flex flex-column m-3 w-full">
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
                  <TextArea controller={{ name: 'contenido.sistemas.observaciones' }} block rows={4} />
                </div>
              </div>
            </div>

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 m-3">
              <div className=" flex flex-row flex-wrap justify-content-between">
                <h3 className="my-1 align-self-center">4. ANTECEDENTES PERSONALES: </h3>
                <div className="my-1">
                  <p>REDONDO = CON PATOLOGÍA: DESCRIBIR</p>
                  <p>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</p>
                </div>
              </div>
              <hr className="my-5" />
              <div className="w-full">
                <CheckOptionsMultipleInline
                  label="ALERTAS DE RIESGO"
                  options={[
                    {
                      labelText: '1. CAÍDA',
                      controller: {
                        name: 'contenido.antecedentesPersonales.alertasRiesgo.caida',
                      },
                    },
                    {
                      labelText: '2. DISMOVILIDAD',
                      controller: {
                        name: 'contenido.antecedentesPersonales.alertasRiesgo.dismovilidad',
                      },
                    },
                    {
                      labelText: '3. PÉRDIDA DE PESO',
                      controller: {
                        name: 'contenido.antecedentesPersonales.alertasRiesgo.perdidaPeso',
                      },
                    },
                    {
                      labelText: '4. ASTENIA',
                      controller: {
                        name: 'contenido.antecedentesPersonales.alertasRiesgo.astenia',
                      },
                    },
                    {
                      labelText: '5. DESORIENTACIÓN',
                      controller: {
                        name: 'contenido.antecedentesPersonales.alertasRiesgo.desorientacion',
                      },
                    },
                    {
                      labelText: '6. ALTERACIONES DEL COMPORTAMIENTO',
                      controller: {
                        name: 'contenido.antecedentesPersonales.alertasRiesgo.alteracionesComportamiento',
                      },
                    },
                  ]}
                />
                <TextArea controller={{ name: 'contenido.antecedentesPersonales.alertasRiesgo.observaciones' }} block />
                <hr className="my-5" />
              </div>
              <div className="w-full">
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
                <hr className="my-5" />
              </div>

              <div className="w-full">
                <CheckOptionsMultipleInline
                  label="HABITOS NOCIVOS"
                  options={[
                    {
                      labelText: '1. TABASQUISMO',
                      controller: {
                        name: 'contenido.antecedentesPersonales.habitosNocivos.tabaquismo',
                      },
                    },
                    {
                      labelText: '2. ALCOHOLISMO',
                      controller: {
                        name: 'contenido.antecedentesPersonales.habitosNocivos.alcoholismo',
                      },
                    },
                    {
                      labelText: '3. ADICCIONES',
                      controller: {
                        name: 'contenido.antecedentesPersonales.habitosNocivos.adicciones',
                      },
                    },
                    {
                      labelText: '4. OTRO HABITO',
                      controller: {
                        name: 'contenido.antecedentesPersonales.habitosNocivos.otro',
                      },
                    },
                  ]}
                />
                <TextArea
                  controller={{ name: 'contenido.antecedentesPersonales.habitosNocivos.observaciones' }}
                  block
                />
                <hr className="my-5" />
              </div>

              <div className="w-full">
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
                <hr className="my-5" />
              </div>

              <div className="w-full">
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
                <hr className="my-5" />
              </div>

              <div className="w-full">
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
                <TextArea controller={{ name: 'contenido.antecedentesPersonales.andrologicos.observaciones' }} block />
                <hr className="my-5" />
              </div>

              <div className="w-full">
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

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 m-3">
              <div className="flex flex-column m-3">
                <div className="flex flex-wrap justify-content-between">
                  <h3 className="align-self-center">5. ANTECEDENTES FAMILIARES Y SOCIALES: </h3>
                  <div>
                    <p>REDONDO = CON PATOLOGÍA: DESCRIBIR</p>
                    <p>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</p>
                  </div>
                </div>

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
                  block
                  rows={4}
                  controller={{ name: 'contenido.antecedentesFamiliares.antecedentes.observaciones' }}
                />
              </div>
            </div>

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 m-3">
              <div className="flex flex-column m-3">
                <h3 className="my-4">6. SIGNOS VITALES, ANTROPOMETRIA Y TAMIZAJE: </h3>
                <div className="flex flex-row flex-wrap justify-content-around">
                  <div className="flex flex-column text-center justify-content-center">
                    <label
                      htmlFor="contenido.signosVitales.presionAterial.acostado.numerador"
                      style={{ maxWidth: '10rem', minHeight: '2rem' }}
                    >
                      P. ARTERIAL ACOSTADO
                    </label>
                    <div className="w-full">
                      <div className="p-inputgroup justify-content-center">
                        <TextInput
                          id="contenido.signosVitales.presionAterial.acostado.numerador"
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
                  <div className="flex flex-column text-center justify-content-center">
                    <label
                      htmlFor="contenido.signosVitales.presionAterial.sentado.numerador"
                      style={{ maxWidth: '10rem', minHeight: '2rem' }}
                    >
                      P. ARTERIAL SENTADO
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-center">
                    <label
                      htmlFor="contenido.signosVitales.temperatura"
                      style={{ maxWidth: '10rem', minHeight: '2rem' }}
                    >
                      TEMPERATURA C
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-center">
                    <label htmlFor="contenido.signosVitales.pulSo" style={{ maxWidth: '10rem', minHeight: '2rem' }}>
                      PULSO / mm
                    </label>
                    <div className="w-full">
                      <TextInput
                        id="contenido.signosVitales.pulSo"
                        className="text-center"
                        style={{ maxWidth: '6rem' }}
                        controller={{ name: 'contenido.signosVitales.pulSo' }}
                      />
                    </div>
                  </div>
                  {/* FRECUENCIA RESPIR. / mm */}
                  <div className="flex flex-column text-center justify-content-center">
                    <label
                      htmlFor="contenido.signosVitales.frecuencoaRespiratoria"
                      style={{ maxWidth: '10rem', minHeight: '2rem' }}
                    >
                      FRECUENCIA RESPIR. / mm
                    </label>
                    <div className="w-full">
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

                <hr className="my-5" />

                <div className="flex flex-row flex-wrap justify-content-around">
                  {/* PESO / kg */}
                  <div className="flex flex-column text-center justify-content-between my-3">
                    <label htmlFor="contenido.signosVitales.peso" style={{ maxWidth: '10rem', minHeight: '2rem' }}>
                      PESO / kg
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-between my-3">
                    <label htmlFor="contenido.signosVitales.talla" style={{ maxWidth: '10rem', minHeight: '2rem' }}>
                      TALLA / cm
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-between my-3">
                    <label htmlFor="contenido.signosVitales.imc" style={{ maxWidth: '10rem', minHeight: '2rem' }}>
                      IMC
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-between my-3">
                    <label
                      htmlFor="contenido.signosVitales.perimetroCintura"
                      style={{ maxWidth: '9rem', minHeight: '2rem' }}
                    >
                      PERIMETRO CINTURA
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-between my-3">
                    <label
                      htmlFor="contenido.signosVitales.perimetroCadera"
                      style={{ maxWidth: '9rem', minHeight: '2rem' }}
                    >
                      PERIMETRO CADERA
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-between my-3">
                    <label
                      htmlFor="contenido.signosVitales.perimetroPantorrilla"
                      style={{ maxWidth: '10rem', minHeight: '2rem' }}
                    >
                      PERIMETRO PANTORRILLA
                    </label>
                    <div className="w-full">
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
                  <div className="flex flex-column text-center justify-content-between my-3">
                    <label
                      htmlFor="contenido.signosVitales.responsableSiglas"
                      style={{ maxWidth: '10rem', minHeight: '2rem' }}
                    >
                      RESPONSABLE SIGLAS
                    </label>
                    <div className="w-full">
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

                <div className="w-full">
                  <hr className="my-5" />
                </div>
                <div>
                  <CheckOptionsInlineCirculoCuadrado
                    label="TAMIZAJE RAPIDO"
                    options={[
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.dificultadVisual' },
                        labelText: '1. DIFICULTAD VISUAL',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.dificultadAuditiva' },
                        labelText: '2. DIFICULTAD AUDITIVA',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.levantateAndaMayora15s' },
                        labelText: '3. "LEVANTATE Y ANDA" MAYOR A 15s',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.perdidaInvoluntariaOrina' },
                        labelText: '4. PERDIDA INVOLUNTARIA DE ORINA',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.perdidaMemoriaReciente' },
                        labelText: '5. PERDIDA DE MEMORIA RECIENTE',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.pierdePeso' },
                        labelText: '6. PIERDE PESO MAS DE 4.5KG EN 5 MESES',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.tristeDeprimido' },
                        labelText: '7. SE SIENTE TRISTE DEPRIMIDO',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.baniarseSolo' },
                        labelText: '8. PRUEBA BAÑARSE SOLO',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.saleComprasSola' },
                        labelText: '9. SALE DE COMPRAS SOLO',
                      },
                      {
                        controller: { name: 'contenido.signos.tamizajeRapido.viveSolo' },
                        labelText: '10. VIVE SOLO',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 m-3">
              <div className="flex flex-column m-3">
                <div className="flex flex-wrap justify-content-between">
                  <h3 className="align-self-center">7. EXAMEN FÍSICO: </h3>
                  <div className="my-1">
                    <p>REDONDO = CON PATOLOGÍA: DESCRIBIRCON EL NUMERO</p>
                    <p>CUADRADO = SIN PATOLOGÍA: NO DESCRIBIR</p>
                  </div>
                </div>
                <div>
                  <hr className="my-5" />
                </div>

                <CheckOptionsInlineCirculoCuadrado
                  label="REGIONAL (1-14)"
                  options={[
                    {
                      labelText: '1. PIEL',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.piel',
                      },
                    },
                    {
                      labelText: '2. CABEZA',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.cabeza',
                      },
                    },
                    {
                      labelText: '3. OJOS',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.ojos',
                      },
                    },
                    {
                      labelText: '4. OÍDOS',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.oidos',
                      },
                    },
                    {
                      labelText: '5. BOCA',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.boca',
                      },
                    },
                    {
                      labelText: '6. NARIZ',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.nariz',
                      },
                    },
                    {
                      labelText: '7. CUELLO',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.cuello',
                      },
                    },
                    {
                      labelText: '8. AXILA-MAMA',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.axilamama',
                      },
                    },
                    {
                      labelText: '9. TORAX',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.torax',
                      },
                    },
                    {
                      labelText: '10. ABDOMEN',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.abdomen',
                      },
                    },
                    {
                      labelText: '11. COLUMNA',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.columna',
                      },
                    },
                    {
                      labelText: '12. PERINÉ',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.perine',
                      },
                    },
                    {
                      labelText: '13. M. SUPERIORES',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.msuperiores',
                      },
                    },
                    {
                      labelText: '14. M. INFERIORES',
                      controller: {
                        name: 'contenido.examenFisico.regional.opciones.minferiores',
                      },
                    },
                  ]}
                />

                <TextArea controller={{ name: 'contenido.examenFisico.regional.observaciones' }} block rows={6} />

                <div>
                  <hr className="my-5" />
                </div>

                <CheckOptionsInlineCirculoCuadrado
                  label="SISTEMATICO (1-9)"
                  options={[
                    {
                      labelText: '1. ORG DE LOS SENTIDOS',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.orgsentidos',
                      },
                    },
                    {
                      labelText: '2. RESPIRATORIO',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.respiratorio',
                      },
                    },
                    {
                      labelText: '3. CARDIO VASCULAR',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.cardiovascular',
                      },
                    },
                    {
                      labelText: '4. DIGESTIVO',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.digestivo',
                      },
                    },
                    {
                      labelText: '5. DENITO URINARIO',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.denitourinario',
                      },
                    },
                    {
                      labelText: '6. MUSCULO ESQUELETICO',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.musculoesqueletico',
                      },
                    },
                    {
                      labelText: '7. ENDOCRINO',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.endocrino',
                      },
                    },
                    {
                      labelText: '8. HEMO LINFATICO',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.hemolinfatico',
                      },
                    },
                    {
                      labelText: '9. NEUROLÓGICO',
                      controller: {
                        name: 'contenido.examenFisico.sistematico.opciones.neurologico',
                      },
                    },
                  ]}
                />
                <TextArea controller={{ name: 'contenido.examenFisico.sistematico.observaciones' }} block />
              </div>
            </div>

            <Diagnosticos />
            {/* <div className="col-8 grid grid-nogutter justify-content-center my-3">
              <div className="lg:col-11 border-1 border-gray-200">
                <div className="flex flex-column m-3">
                  <h4 className="font-bold my-4">8. DIAGNOSTICOS</h4>
                  <Controller
                    name="contenido.diagnosticos.items"
                    defaultValue={[]}
                    render={({ field: { value, onChange } }) => (
                      <div className="table-responsive-sm">
                        <table className="table table-border-1 border-gray-200ed table-hover table-striped">
                          <thead>
                            <tr className="text-center">
                              <th style={{ width: '50px' }}>#</th>
                              <th>DIAGNOSTICO</th>
                              <th style={{ width: '50px' }}>P</th>
                              <th style={{ width: '50px' }}>D</th>
                              <th>CIE</th>
                              <th>OPCIONES</th>
                              <th>
                                <i className={PrimeIcons.TRASH} />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {value?.map((item, index) => (
                              <tr key={item.uuid}>
                                <td className="text-center font-bold align-vertical-middle p-0 m-0">{index + 1}</td>
                                <td className="align-vertical-middle p-0 m-0">
                                  <input
                                    className="w-full form-control"
                                    type="text"
                                    name={`diagnostico.${index}`}
                                    value={item.diagnostico}
                                    onChange={(evt) => {
                                      const itemIndex = value.findIndex((row) => row.uuid === item.uuid);
                                      value[itemIndex].diagnostico = evt.target.value;
                                      onChange([...value]);
                                    }}
                                  />
                                </td>
                                <td className="text-center align-vertical-middle p-0 m-0">
                                  <input
                                    type="checkbox"
                                    name={`estado.${index}`}
                                    className="w-full form-check"
                                    checked={item.p}
                                    onChange={(evt) => {
                                      const itemIndex = value.findIndex((row) => row.uuid === item.uuid);
                                      value[itemIndex].p = evt.target.checked;
                                      value[itemIndex].d = false;
                                      onChange([...value]);
                                    }}
                                  />
                                </td>
                                <td className="text-center align-vertical-middle p-0 m-0">
                                  <input
                                    type="checkbox"
                                    className="w-full form-check"
                                    name={`estado.${index}`}
                                    checked={item.d}
                                    onChange={(evt) => {
                                      const itemIndex = value.findIndex((row) => row.uuid === item.uuid);
                                      value[itemIndex].d = evt.target.checked;
                                      value[itemIndex].p = false;
                                      onChange([...value]);
                                    }}
                                  />
                                </td>
                                <td className="align-vertical-middle p-0 m-0">
                                  <input
                                    className="w-full form-control"
                                    type="text"
                                    name={`diagnostico.${index}`}
                                    value={item.cie}
                                    onChange={(evt) => {
                                      const itemIndex = value.findIndex((row) => row.uuid === item.uuid);
                                      value[itemIndex].cie = evt.target.value;
                                      onChange([...value]);
                                    }}
                                  />
                                </td>
                                <td className="align-vertical-middle p-0 m-0">
                                  <select
                                    className="w-full form-control"
                                    value={item.opcion}
                                    onChange={(evt) => {
                                      const itemIndex = value.findIndex((row) => row.uuid === item.uuid);
                                      value[itemIndex].opcion = evt.target.value;
                                      onChange([...value]);
                                    }}
                                    placeholder="SELECCIONE"
                                  >
                                    <option value="">SELECCIONE</option>
                                    <option value="CLINICO">CLINICO</option>
                                    <option value="SINDROMICO">SINDROMICO</option>
                                    <option value="PSICOLOGICO">PSICOLOGICO</option>
                                    <option value="FUNCIONAL">FUNCIONAL</option>
                                    <option value="NUTRICIONAL">NUTRICIONAL</option>
                                  </select>
                                </td>
                                <td className="align-vertical-middle p-0 m-0 text-center" style={{ width: '50px' }}>
                                  <Button
                                    icon={PrimeIcons.TRASH}
                                    sm
                                    outlined
                                    rounded
                                    text
                                    onClick={() => onChange(value.filter((option) => option.uuid !== item.uuid))}
                                  />
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={100}>
                                <Button
                                  block
                                  label="AGREGAR DIAGNOSTICO"
                                  outlined
                                  sm
                                  onClick={() => onChange([...value, { uuid: uuid.v4() }])}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  />

                  <CheckOptionsMultipleInline
                    label="SINDROMES GERIATRICOS"
                    options={[
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.fragilidad' },
                        labelText: 'FRAGILIDAD',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.dismovilidad' },
                        labelText: 'DISMOVILIDAD',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.depresion' },
                        labelText: 'DEPRESION',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.caida' },
                        labelText: 'CAIDA',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.delirio' },
                        labelText: 'DELIRIO',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.malnutricion' },
                        labelText: 'MALNUTRICION',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.ulcerasPorPresion' },
                        labelText: 'ULCERAS POR PRESION',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.demencia' },
                        labelText: 'DEMENCIA',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.incontinencia' },
                        labelText: 'INCONTINENCIA',
                      },
                      {
                        controller: { name: 'contenido.diagnosticos.sindromes.latrogenia' },
                        labelText: 'LATROGENIA',
                      },
                    ]}
                  />
                </div>
              </div>
            </div> */}

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 m-3">
              <div className="flex flex-column m-3">
                <h3>9. PRUEBAS DIAGNÓSTICAS:</h3>
                <label htmlFor="contenido.pruebasDiagnosticas.observaciones">
                  REGISTRAR LOS EXÁMENES DE LABORATORIO Y ESPECIALES SOLICITADOS
                </label>
                <div>
                  <TextArea
                    id="contenido.pruebasDiagnosticas.observaciones"
                    controller={{ name: 'contenido.pruebasDiagnosticas.observaciones' }}
                    block
                    rows={6}
                  />
                </div>
              </div>
            </div>

            <div className="col-11 md:col-10 lg:col-9 border-1 border-gray-200 px-4 pb-4 m-3">
              <div className="flex flex-column m-3">
                <h3 className="my-4">10. TRATAMIENTO</h3>
                <label htmlFor="contenido.tratamiento.observaciones">
                  1. FUNCIONAL, 2. NUTRICIONAL, 3. PSICOLÓGICO, 4. SOCIAL, 5. EDUCATIVO, 6. FARMACOLÓGICO
                </label>
                <TextArea
                  id="contenido.tratamiento.observaciones"
                  controller={{ name: 'contenido.tratamiento.observaciones' }}
                  block
                  rows={6}
                />
              </div>
            </div>
            <FloatingButton icon={PrimeIcons.SAVE} onClick={methods.handleSubmit(onSubmit)} />
          </form>
        </main>
      </PrivateLayout>
    </FormProvider>
  );
};

FichaIngresoFormPage.getInitialProps = ({ query }) => query as any;
FichaIngresoFormPage.help = {
  title: 'Formulario de registro de ficha de ingreso del paciente',
  content: 'Formulario de ingreso de datos de ficha de ingreso del paciente',
};

export default FichaIngresoFormPage;
