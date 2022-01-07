import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCreatePermiso, urlUpdatePermiso } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FormPermiso: NextPage<{ id: string | number; crudAction: CrudActions }> = (props) => {
  const methods = useForm({ mode: 'onChange' });

  useQuery(['permiso'], () => API.private().get(urlUpdatePermiso(props.id)), {
    enabled: props.id !== undefined,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      methods.reset(data?.data);
    },
  });

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
      create: urlCreatePermiso,
      editar: urlUpdatePermiso(id),
    }),
    [],
  );

  const mutation = useMutation((formData) => API.private()[method[crudAction]](url[crudAction], formData));

  const _onSubmit = async (formData) => {
    try {
      await mutation.mutateAsync(formData);
      console.log(formData);
      router.push('/auditoria/permisos/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider {...methods}>
      <PrivateLayout title="Personal">
        <main className="container">
          <h1 className="text-center my-5">
            <Button outlined rounded href="/auditoria/permisos" icon={PrimeIcons.ARROW_LEFT} />
            Formulario de Permiso
          </h1>
          <div className="row justify-content-center">
            <div className="col-11 border">
              <div className="row justify-content-center">
                <div className="col-11">
                  <form onSubmit={methods.handleSubmit(_onSubmit)} className="row justify-content-center py-5">
                    <div className="col-11 my-5">
                      <label htmlFor="codigo">Código: *</label>

                      <TextInput
                        block
                        controller={{ name: 'codigo', rules: { required: 'Este campo es obligatorio' } }}
                      />

                      <ErrorMessage name="codigo" />
                    </div>
                    <div className="col-11 my-5">
                      <label htmlFor="descripcion">Descripción: *</label>
                      <TextArea
                        block
                        controller={{ name: 'descripcion', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="descripcion" />
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <div className="col-md-6 my-2">
                          <Button label="Regresar" block href="/auditoria/permisos/" variant="info" />
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

FormPermiso.getInitialProps = ({ query }) => query as any;
FormPermiso.help = {
  title: 'Formulario de registro de Permisos',
  content: 'Formulario para ingreso de datos de Permisos',
}

export default FormPermiso;
