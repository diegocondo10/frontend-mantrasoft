import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import Toggle from '@src/components/Forms/Toggle';
import { PAISES } from '@src/constants/paises';
import { CrudActions } from '@src/emuns/crudActions';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoCreate, urlCreatePersona, urlDetailPersona, urlUpdatePersona } from '@src/services/urls';
import { formatearFechaBackend } from '@src/utils/date';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const CreatePersonaPage: NextPage<{ crudAction: CrudActions; id: any }> = ({ crudAction, id }) => {
  const methods = useForm({ mode: 'onChange' });

  const router = useRouter();
  const { addErrorToast } = useToasts();

  const query = useQuery(['persona', crudAction, id], () => API.private().get(urlDetailPersona(id)), {
    enabled: crudAction === CrudActions.UPDATE,
    onSuccess: (data) => {
      methods.reset(data?.data);
    },
    onError: () => {
      addErrorToast('No se ha podido encontrar el registro');
      router.push('/medicamentos');
    },
  });

  const queryCatalogo = useQuery(['catalogo-create'], () => API.private().get(urlCatalogoCreate), {
    enabled: crudAction === CrudActions.CREATE,
  });

  const updateMutation = useMutation<any>((formData: any) => API.private().put(urlUpdatePersona(id), formData));

  const createMutation = useMutation<any>((formData: any) => API.private().post(urlCreatePersona, formData));

  const _onSubmit = async (formData) => {
    let res: AxiosResponse = null;
    const Data = {
      ...formData,
      fechaNacimiento: formatearFechaBackend(formData.fechaNacimiento),
    };
    try {
      if (CrudActions.CREATE === crudAction) {
        res = await createMutation.mutateAsync(Data);
      } else if (CrudActions.UPDATE === crudAction) {
        res = await updateMutation.mutateAsync(Data);
      }
      if (res.status === 201 || res.status === 200) {
        router.push('/personas');
      }
    } catch (error) {
      console.log(error);
      methods.reset(formData);
      alert('Ha ocurrido un problema al guardar la información');
    }
  };
  console.log(queryCatalogo);
  return (
    <FormProvider {...methods}>
      <PrivateLayout
        loading={{
          loading: query.isLoading || createMutation.isLoading || updateMutation.isLoading,
        }}
      >
        <main className="container-fluid">
          <div className="d-flex flex-row my-3 justify-content-center">
            <div className="align-self-center">
              <Button href="/personas" sm rounded icon={PrimeIcons.ARROW_LEFT} outlined />
            </div>
            {CrudActions.CREATE === crudAction && (
              <h3 className="text-center align-self-center">Registro de información</h3>
            )}
            {CrudActions.UPDATE === crudAction && <h3 className="text-center align-self-center">Editar información</h3>}
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-11 border mb-5">
              <div className="row justify-content-center">
                <div className="col-11 mb-5">
                  <form onSubmit={methods.handleSubmit(_onSubmit)} className="row mb-5">
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
                            options={['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'UNION LIBRE']}
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
                            options={['HOMBRE', 'MUJER', 'OTRO']}
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
                      <label htmlFor="pais">País: *</label>
                      <Controller
                        name="pais"
                        render={({ field }) => (
                          <Dropdown
                            inputId="pais"
                            options={PAISES}
                            {...field}
                            showClear
                            filter
                            filterMatchMode="contains"
                            placeholder="Seleccione"
                            className={classNames('w-full')}
                          />
                        )}
                      />
                      <ErrorMessage name="pais" />
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
                          <InputText id="NumeroCasa" {...field} className={classNames('w-full')} />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Calle Secundaria: *</label>
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
                    <div className="col-md-6">
                      <label>Referencia:</label>
                      <Controller
                        name="referencia"
                        render={({ field }) => (
                          <InputText id="referencia" {...field} className={classNames('w-full')} />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Sector:</label>
                      <Controller
                        name="sector"
                        render={({ field }) => <InputText id="sector" {...field} className={classNames('w-full')} />}
                      />
                    </div>
                    <hr className="my-5" />
                    <div className="col-12">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="sexo">Tipo de Sangre: *</label>
                          <Controller
                            name="tipoSangre"
                            render={({ field }) => (
                              <Dropdown
                                inputId="tipoSangre"
                                options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                                {...field}
                                showClear
                                placeholder="Seleccione"
                                className={classNames('w-full')}
                              />
                            )}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="tieneIess" className="w-full">
                            Tiene seguro de IESS?
                          </label>
                          <Toggle name="tieneIess" size="lg" />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="tieneHipertencion" className="w-full">
                            Tiene Hipertención?
                          </label>
                          <Toggle name="tieneHipertencion" size="lg" />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="tieneDiabetes" className="w-full">
                            Tiene diabetes?
                          </label>
                          <Toggle name="tieneDiabetes" size="lg" />
                        </div>
                      </div>
                    </div>

                    {crudAction === CrudActions.CREATE && (
                      <React.Fragment>
                        <hr className="my-5" />

                        <div className="col-12">
                          <label htmlFor="usuario.generar" className="w-full">
                            Generar un usuario?
                          </label>
                          <Toggle name="usuario.generar" size="lg" defaultValue={false} />
                        </div>

                        {methods.watch('usuario.generar') && (
                          <React.Fragment>
                            <div className="col-md-6">
                              <label className="w-full">Seleccione el rol para el usuario:</label>
                              <ErrorMessage name="usuario.rol" />
                              <Controller
                                name="usuario.rol"
                                rules={{ required: 'Es necesario seleccionar un rol!' }}
                                render={({ field }) => (
                                  <React.Fragment>
                                    {queryCatalogo?.data?.data?.roles?.map((rol) => (
                                      <div className="w-full" key={rol.value}>
                                        <input
                                          type="radio"
                                          name="usuario.rol"
                                          id={rol.value}
                                          checked={field.value === rol.value}
                                          onChange={() => field.onChange(rol.value)}
                                        />
                                        <label className="font-bold" htmlFor={rol.value}>
                                          {rol.label}
                                        </label>
                                      </div>
                                    ))}
                                  </React.Fragment>
                                )}
                              />
                            </div>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}

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
                </div>
              </div>
            </div>
          </div>
        </main>
      </PrivateLayout>
    </FormProvider>
  );
};

CreatePersonaPage.getInitialProps = ({ query }) => query as any;

CreatePersonaPage.help ={
  title:'Formulario de registro de datos de personas dentro del sistema',
  content:'Formulario de ingreso de datos de personas',
}

export default CreatePersonaPage;
