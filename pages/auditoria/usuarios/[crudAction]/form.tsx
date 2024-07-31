import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import HiddenField from '@src/components/Forms/HiddenField';
import TextInput from '@src/components/Forms/TextInput';
import PageTitle from '@src/components/PageTitle';
import { CrudActions } from '@src/emuns/crudActions';
import useCreateUpdate from '@src/hooks/useCreateUpdate';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoFormUsuarios, urlUpdateUsuarios } from '@src/services/urls';
import { UsuarioService } from '@src/services/usuario/usuario.service';
import { PK } from '@src/types/api';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

interface FormUsuarioPageProps {
  id: PK;
  crudAction: CrudActions.CREATE | CrudActions.UPDATE;
  title: string;
}

const FormUsuarioPage: CustomNextPage<FormUsuarioPageProps> = ({ id, crudAction, title }) => {
  const methods = useForm({ mode: 'onChange' });

  const toast = useToasts();

  const catalogo = useQuery<AxiosResponse<any>>(
    ['catalogo-form-usuarios'],
    () => API.private().get(urlCatalogoFormUsuarios),
    {
      refetchOnWindowFocus: false,
    },
  );

  const query = useQuery(['usuario', id, crudAction], () => API.private().get(urlUpdateUsuarios(id)), {
    enabled: crudAction === CrudActions.UPDATE && !!id,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      methods.reset(data?.data);
    },
  });

  const mutation = useCreateUpdate({
    action: crudAction,
    methods,
    create: (formData) => new UsuarioService().create(formData),
    update: (formData) => new UsuarioService().update(id, formData),
    onSuccess: () => {
      toast.addSuccessToast('Usuario guardado exitosamente');
      Router.push('/auditoria/usuarios/');
    },
  });

  const _onSubmit = async (formData) => {
    await mutation.submitForm(formData);
  };
  return (
    <FormProvider {...methods}>
      <PrivateLayout
        title="Usuario"
        loading={{ loading: query.isFetching || catalogo.isFetching || mutation.isLoading }}
        breadCrumbItems={[
          {
            label: 'Usuarios',
            command: commandPush('/auditoria/usuarios'),
          },
          {
            label: title,
          },
        ]}
      >
        <HiddenField name="prueba.interna.interno2" />
        <main className="grid grid-nogutter justify-content-center my-5">
          <div className="col-12">
            <PageTitle>{title}</PageTitle>
          </div>
          <div className="col-11 md:col-10 lg:col-8 xl:col-6 border-1 border-gray-200">
            <form onSubmit={methods.handleSubmit(_onSubmit)} className="grid justify-content-center py-5">
              <div className="field col-10 my-1">
                <label htmlFor="username">Identificador: *</label>
                <TextInput
                  disabled={crudAction === CrudActions.UPDATE}
                  block
                  controller={{ name: 'username', rules: { required: 'Este campo es obligatorio' } }}
                />
                <ErrorMessage name="username" />
              </div>

              <div className="field col-10 md:col-5 my-1">
                <label htmlFor="firstName">Primer nombre: *</label>
                <TextInput block controller={{ name: 'firstName', rules: { required: 'Este campo es obligatorio' } }} />
                <ErrorMessage name="firstName" />
              </div>

              <div className="field col-10 md:col-5 my-1">
                <label htmlFor="secondName">Segundo nombre: *</label>
                <TextInput block controller={{ name: 'secondName' }} />
                <ErrorMessage name="secondName" />
              </div>

              <div className="field col-10 md:col-5 my-1">
                <label htmlFor="lastName">Primer apellido: *</label>
                <TextInput block controller={{ name: 'lastName', rules: { required: 'Este campo es obligatorio' } }} />
                <ErrorMessage name="lastName" />
              </div>

              <div className="field col-10 md:col-5 my-1">
                <label htmlFor="secondLastName">Segundo apellido: *</label>
                <TextInput block controller={{ name: 'secondLastName' }} />
                <ErrorMessage name="secondLastName" />
              </div>

              <div className="field col-10 my-1">
                <label htmlFor="email">Email: *</label>
                <TextInput block controller={{ name: 'email', rules: { required: 'Este campo es obligatorio' } }} />
                <ErrorMessage name="email" />
              </div>
              <div className="field col-10 my-1">
                <label htmlFor="rol">Rol Asignado: *</label>
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
