import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import PageTitle from '@src/components/PageTitle';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoFormUsuarios, urlCreateUsuarios, urlUpdateUsuarios } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import router from 'next/router';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FormUsuarioPage: CustomNextPage<{ id: string | number; crudAction: CrudActions; title: string }> = (props) => {
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
      await mutation.mutateAsync(formData);
      router.push('/auditoria/usuarios/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider {...methods}>
      <PrivateLayout
        title="Usuario"
        loading={{ loading: query.isFetching || catalogo.isFetching }}
        breadCrumbItems={[
          {
            label: 'Usuarios',
            command: commandPush('/auditoria/usuarios'),
          },
          {
            label: props.title,
          },
        ]}
      >
        <main className="grid grid-nogutter justify-content-center my-5">
          <div className="col-12">
            <PageTitle>{props.title}</PageTitle>
          </div>
          <div className="col-11 lg:col-10 border-1 border-gray-200">
            <form onSubmit={methods.handleSubmit(_onSubmit)} className="grid justify-content-center py-5">
              <div className="col-10 my-1">
                <label className="mb-2" htmlFor="username">
                  Identificador: *
                </label>
                <TextInput
                  disabled={crudAction === CrudActions.UPDATE}
                  block
                  controller={{ name: 'username', rules: { required: 'Este campo es obligatorio' } }}
                />
                <ErrorMessage name="username" />
              </div>

              <div className="col-10 md:col-5 my-1">
                <label className="mb-2" htmlFor="firstName">
                  Primer nombre: *
                </label>
                <TextInput block controller={{ name: 'firstName', rules: { required: 'Este campo es obligatorio' } }} />
                <ErrorMessage name="firstName" />
              </div>

              <div className="col-10 md:col-5 my-1">
                <label className="mb-2" htmlFor="secondName">
                  Segundo nombre: *
                </label>
                <TextInput block controller={{ name: 'secondName' }} />
                <ErrorMessage name="secondName" />
              </div>

              <div className="col-10 md:col-5 my-1">
                <label className="mb-2" htmlFor="lastName">
                  Primer apellido: *
                </label>
                <TextInput block controller={{ name: 'lastName', rules: { required: 'Este campo es obligatorio' } }} />
                <ErrorMessage name="lastName" />
              </div>

              <div className="col-10 md:col-5 my-1">
                <label className="mb-2" htmlFor="secondLastName">
                  Segundo apellido: *
                </label>
                <TextInput block controller={{ name: 'secondLastName' }} />
                <ErrorMessage name="secondLastName" />
              </div>

              <div className="col-10 my-1">
                <label className="mb-2" htmlFor="email">
                  Email: *
                </label>
                <TextInput block controller={{ name: 'email', rules: { required: 'Este campo es obligatorio' } }} />
                <ErrorMessage name="email" />
              </div>
              <div className="col-10 my-1">
                <label className="my-5" htmlFor="rol">
                  Rol Asignado: *
                </label>
                <DropDown
                  controller={{
                    name: 'rol',
                    rules: {
                      required: 'Este campo es obligatorio',
                    },
                  }}
                  filter
                  block
                  options={catalogo?.data?.data?.roles}
                />
                <ErrorMessage name="rol" />
              </div>

              <div className="col-10 grid grid-nogutter justify-content-between">
                <div className="md:col-5 my-2">
                  <Button label="Regresar" block href="/auditoria/usuarios/" variant="info" outlined />
                </div>
                <div className="md:col-5 my-2">
                  <Button label="Guardar" block type="submit" outlined onClick={methods.handleSubmit(_onSubmit)} />
                </div>
              </div>
            </form>
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
      title: crudAction === CrudActions.CREATE ? 'Crear usuario' : 'Editar usuario',
    },
  };
};
FormUsuarioPage.help = {
  title: 'Formulario de registro de usuarios',
  content: 'Formulario de ingreso de parámetros para la creación de usuarios',
};

export default FormUsuarioPage;
