import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import Toggle from '@src/components/Forms/Toggle';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoFormUsuarios, urlCreateUsuarios, urlUpdateUsuarios } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { ListBox } from 'primereact/listbox';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FormUsuarioPage: NextPage<{ id: string | number; crudAction: CrudActions }> = (props) => {
  const methods = useForm({ mode: 'onChange' });

  const catalogo = useQuery<AxiosResponse<any>>(
    ['catalogo-form-usuarios'],
    () => API.private().get(urlCatalogoFormUsuarios),
    {
      refetchOnWindowFocus: false,
    },
  );

  const query = useQuery(
    ['usuario', props.id, props.crudAction],
    () => API.private().get(urlUpdateUsuarios(props.id)),
    {
      enabled: props.id !== undefined,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log(data);
        methods.reset(data?.data);
      },
    },
  );

  const { id, crudAction } = props;

  const method = useMemo(
    () => ({
      create: 'post',
      editar: 'put',
    }),
    [],
  );

  const url = useMemo(
    () => ({
      create: urlCreateUsuarios,
      editar: urlUpdateUsuarios(id),
    }),
    [],
  );

  const mutation = useMutation((formData) => API.private()[method[crudAction]](url[crudAction], formData));

  const _onSubmit = async (formData) => {
    try {
      if (!formData?.persona) {
        formData.persona = null;
      }
      await mutation.mutateAsync(formData);
      router.push('/auditoria/usuarios/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider {...methods}>
      <PrivateLayout title="Usuario" loading={{ loading: query.isFetching || catalogo.isFetching }}>
        <main className="container">
          <h1 className="text-center my-5">
            <Button outlined rounded href="/auditoria/usuarios" icon={PrimeIcons.ARROW_LEFT} />
            Formulario de Usuario
          </h1>
          <div className="row justify-content-center">
            <div className="col-11 border">
              <div className="row justify-content-center">
                <div className="col-12">
                  <form onSubmit={methods.handleSubmit(_onSubmit)} className="row justify-content-center py-5">
                    <div className="col-10 my-1">
                      <label htmlFor="username">Username: *</label>
                      <TextInput
                        block
                        controller={{ name: 'username', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="username" />
                    </div>

                    <div className="col-10 md:col-5 my-1">
                      <label htmlFor="firstName">Primer nombre: *</label>
                      <TextInput
                        block
                        controller={{ name: 'firstName', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="firstName" />
                    </div>

                    <div className="col-10 md:col-5 my-1">
                      <label htmlFor="secondName">Segundo nombre: *</label>
                      <TextInput block controller={{ name: 'secondName' }} />
                      <ErrorMessage name="secondName" />
                    </div>

                    <div className="col-10 md:col-5 my-1">
                      <label htmlFor="lastName">Primer apellido: *</label>
                      <TextInput
                        block
                        controller={{ name: 'lastName', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="lastName" />
                    </div>

                    <div className="col-10 md:col-5 my-1">
                      <label htmlFor="secondLastName">Segundo apellido: *</label>
                      <TextInput block controller={{ name: 'secondLastName' }} />
                      <ErrorMessage name="secondLastName" />
                    </div>

                    <div className="col-10 my-1">
                      <label htmlFor="email">Email: *</label>
                      <TextInput
                        block
                        controller={{ name: 'email', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="email" />
                    </div>
                    <div className="col-10 my-1">
                      <label htmlFor="isSuperuser">Es super usuario?: *</label>
                      <Toggle name="isSuperuser" />
                      <ErrorMessage name="isSuperuser" />
                    </div>

                    <div className="col-10 my-1">
                      <label htmlFor="roles" className="w-full">
                        Roles asignados: *
                      </label>
                      <ErrorMessage name="roles" />
                      <Controller
                        name="roles"
                        render={({ field }) => (
                          <ListBox
                            filter
                            filterMatchMode="contains"
                            value={field.value}
                            options={catalogo?.data?.data?.roles}
                            onChange={(e) => field.onChange(e.value)}
                            multiple
                          />
                        )}
                      />
                    </div>
                    <div className="col-10">
                      <div className="row">
                        <div className="col-md-6 my-2">
                          <Button label="Regresar" block href="/auditoria/usuarios/" variant="info" />
                        </div>
                        <div className="col-md-6 my-2">
                          <Button label="Guardar" block type="submit" onClick={methods.handleSubmit(_onSubmit)} />
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

FormUsuarioPage.getInitialProps = ({ query }) => query as any;

FormUsuarioPage.help = {
  title: 'Formulario de registro de usuarios',
  content: 'Formulario de ingreso de parámetros para la creación de usuarios',
};

export default FormUsuarioPage;
