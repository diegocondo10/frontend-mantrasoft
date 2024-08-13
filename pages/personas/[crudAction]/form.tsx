import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import Toggle from '@src/components/Forms/Toggle';
import PageTitle from '@src/components/PageTitle';
import { PAISES } from '@src/constants/paises';
import { REQUIRED_RULE } from '@src/constants/rules';
import { CrudActions } from '@src/emuns/crudActions';
import useCreateUpdate from '@src/hooks/useCreateUpdate';
import { useParametros } from '@src/hooks/useParametros';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { PARAMETROS } from '@src/services/parametro/parametro.enum';
import { PersonaService } from '@src/services/persona/persona.service';
import { PK } from '@src/types/api';
import { CustomNextPage } from '@src/types/next';
import { formatearFechaBackend, toFrontDate } from '@src/utils/date';
import { commandPush } from '@src/utils/router';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

interface PageProps {
  crudAction: CrudActions.CREATE | CrudActions.UPDATE;
  id?: PK;
  title: string;
}

const FormPascientePage: CustomNextPage<PageProps> = ({ crudAction, id, title }) => {
  const methods = useForm({ mode: 'onChange' });

  const router = useRouter();
  const toast = useToasts();

  const query = useQuery(['persona', crudAction, id], () => new PersonaService().retrieve(id), {
    enabled: crudAction === CrudActions.UPDATE,
    onSuccess: (data) => {
      methods.reset({
        ...data?.data,
        fechaNacimiento: toFrontDate(data?.data?.fechaNacimiento),
      });
    },
    onError: () => {
      toast.addErrorToast('No se ha encontrado el registro');
      router.push('/personas');
    },
  });

  const queryParametros = useParametros({
    codigos: [PARAMETROS.IDENTIFICACIONES],
  });

  const mutation = useCreateUpdate({
    action: crudAction,
    methods,
    create: (formData) => new PersonaService().create(formData),
    update: (formData) => new PersonaService().update(id, formData),
    onSuccess: () => {
      router.push('/personas');
    },
  });

  const _onSubmit = async (formData) => {
    const Data = {
      ...formData,
      fechaNacimiento: formatearFechaBackend(formData.fechaNacimiento),
    };
    mutation.submitForm(Data);
  };

  return (
    <FormProvider {...methods}>
      <PrivateLayout
        loading={{
          loading: query.isLoading || queryParametros.isLoading || mutation.isLoading,
        }}
        breadCrumbItems={[
          {
            label: 'Pacientes',
            command: commandPush('/personas'),
          },
          {
            label: title,
          },
        ]}
      >
        <main className="grid grid-nogutter justify-content-center my-5">
          <div className="col-12">
            <PageTitle>{title}</PageTitle>
          </div>
          <div className="col-11 lg:col-10 xl:col-8 border border-1 border-gray-200 mb-5">
            <div className="p-6">
              <form onSubmit={methods.handleSubmit(_onSubmit)} className="grid justify-content-center mb-5">
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="tipoIdentificacion">Tipo de identificación: *</label>
                  <DropDown
                    options={queryParametros?.data?.IDENTIFICACIONES}
                    controller={{
                      name: 'tipoIdentificacion',
                      rules: { ...REQUIRED_RULE },
                    }}
                    block
                  />
                  <ErrorMessage name="tipoIdentificacion" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label>Identificación: *</label>
                  <Controller
                    name="identificacion"
                    rules={{ ...REQUIRED_RULE }}
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Primer Nombre: *</label>
                  <TextInput
                    controller={{
                      name: 'primerNombre',
                      rules: { ...REQUIRED_RULE },
                    }}
                    block
                  />
                  <ErrorMessage name="primerNombre" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label>Segundo Nombre: *</label>
                  <Controller
                    name="segundoNombre"
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Primer Apellido: *</label>
                  <Controller
                    name="primerApellido"
                    rules={{ ...REQUIRED_RULE }}
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Segundo Apellido: *</label>
                  <Controller
                    name="segundoApellido"
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Fecha de Nacimiento: *</label>
                  <Controller
                    name="fechaNacimiento"
                    rules={{ ...REQUIRED_RULE }}
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Celular: *</label>
                  <Controller
                    name="celular"
                    rules={{ ...REQUIRED_RULE }}
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Teléfono: *</label>
                  <Controller
                    name="telefono"
                    rules={{ ...REQUIRED_RULE }}
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Correo: *</label>
                  <Controller
                    name="correo"
                    rules={{ ...REQUIRED_RULE }}
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
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="estadoCivil">Estado Civil: *</label>
                  <Controller
                    name="estadoCivil"
                    rules={{ ...REQUIRED_RULE }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="estadoCivil"
                        options={['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'UNION LIBRE']}
                        {...field}
                        placeholder="Seleccione"
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="estadoCivil" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="genero">Género: *</label>
                  <Controller
                    name="genero"
                    rules={{ ...REQUIRED_RULE }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="genero"
                        options={['MASCULINO', 'FEMENINO']}
                        {...field}
                        placeholder="Seleccione"
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="genero" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="sexo">Sexo: *</label>
                  <Controller
                    name="sexo"
                    rules={{ ...REQUIRED_RULE }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="sexo"
                        options={['HOMBRE', 'MUJER', 'OTRO']}
                        {...field}
                        placeholder="Seleccione"
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="sexo" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="pais">País: *</label>
                  <Controller
                    name="pais"
                    rules={{
                      ...REQUIRED_RULE,
                    }}
                    defaultValue={'ECUADOR'}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="pais"
                        options={PAISES}
                        {...field}
                        filter
                        filterMatchMode="contains"
                        placeholder="Seleccione"
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="pais" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label>Calle Principal: *</label>
                  <Controller
                    name="callePrincipal"
                    rules={{ ...REQUIRED_RULE }}
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Número de casa:</label>
                  <Controller
                    name="numeroCasa"
                    render={({ field }) => <InputText id="NumeroCasa" {...field} className={classNames('w-full')} />}
                  />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label>Calle Secundaria:</label>
                  <Controller
                    name="calleSecundaria"
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
                <div className="field col-12 md:col-6 my-2">
                  <label>Referencia:</label>
                  <Controller
                    name="referencia"
                    render={({ field }) => <InputText id="referencia" {...field} className={classNames('w-full')} />}
                  />
                </div>
                <div className="field col-12 my-2">
                  <label>Sector:</label>
                  <Controller
                    name="sector"
                    render={({ field }) => <InputText id="sector" {...field} className={classNames('w-full')} />}
                  />
                </div>
                <div className="col-12">
                  <hr className="my-5" />
                </div>

                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="sexo">Tipo de Sangre: *</label>
                  <Controller
                    name="tipoSangre"
                    rules={{
                      ...REQUIRED_RULE,
                    }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="tipoSangre"
                        options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                        {...field}
                        placeholder="Seleccione"
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="tipoSangre" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="tieneIess">Tiene seguro de IESS?</label>
                  <Toggle name="tieneIess" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="tieneHipertencion">Tiene Hipertención?</label>
                  <Toggle name="tieneHipertencion" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label htmlFor="tieneDiabetes">Tiene diabetes?</label>
                  <Toggle name="tieneDiabetes" />
                </div>

                <div className="col-11">
                  <div className="grid">
                    <div className="field col-12 md:col-6 my-2">
                      <Button label="Regresar" block href="/personas" variant="info" outlined />
                    </div>
                    <div className="field col-12 md:col-6 my-2">
                      <Button label="Guardar" block type="submit" outlined />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </PrivateLayout>
    </FormProvider>
  );
};

export const getServerSideProps: GetServerSideProps<any> = async ({ query }) => {
  const crudAction = query.crudAction;
  return {
    props: {
      ...query,
      title: crudAction === CrudActions.CREATE ? 'Registrar paciente' : 'Editar paciente',
    },
  };
};
FormPascientePage.help = {
  title: 'Formulario de registro de datos de personas dentro del sistema',
  content: 'Formulario de ingreso de datos de personas',
};
FormPascientePage.isPrivate = true;
export default FormPascientePage;
