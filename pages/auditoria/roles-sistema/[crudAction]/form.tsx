import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoFormRolesSistema, urlCreateRolesSistema, urlUpdateRolesSistema } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { ListBox } from 'primereact/listbox';
import React, { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FormRolSistemaPage: NextPage<{ id?: number | string; crudAction: CrudActions }> = (props) => {
  const methods = useForm({ mode: 'onChange' });

  const catalogo = useQuery<AxiosResponse<any>>(
    ['catalogo-form-roles-sistema'],
    () => API.private().get(urlCatalogoFormRolesSistema),
    {
      refetchOnWindowFocus: false,
    },
  );

  useQuery(['rol-sistema'], () => API.private().get(urlUpdateRolesSistema(props.id)), {
    enabled: props.id !== undefined,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log(data);
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
      create: urlCreateRolesSistema,
      editar: urlUpdateRolesSistema(id),
    }),
    [],
  );

  const mutation = useMutation((formData) => API.private()[method[crudAction]](url[crudAction], formData));

  const _onSubmit = async (formData) => {
    try {
      await mutation.mutateAsync(formData);
      console.log(formData);
      router.push('/auditoria/roles-sistema/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider {...methods}>
      <PrivateLayout title="Rol del sistema">
        <main className="container">
          <h1 className="text-center my-5">
            <Button outlined rounded href="/auditoria/roles-sistema" icon={PrimeIcons.ARROW_LEFT} />
            Formulario de Rol del sistema
          </h1>
          <div className="row justify-content-center">
            <div className="col-11 border">
              <div className="row justify-content-center">
                <div className="col-11">
                  <form onSubmit={methods.handleSubmit(_onSubmit)} className="row justify-content-center py-5">
                    <div className="col-11 my-1">
                      <label htmlFor="nombre">Nombre: *</label>
                      <TextInput
                        block
                        controller={{ name: 'nombre', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="nombre" />
                    </div>
                    <div className="col-11 my-1">
                      <label htmlFor="codigo">Código: *</label>
                      <TextInput
                        block
                        controller={{ name: 'codigo', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="codigo" />
                    </div>
                    <div className="col-11 my-1">
                      <label htmlFor="descripcion">Descripción: *</label>
                      <TextArea
                        block
                        controller={{ name: 'descripcion', rules: { required: 'Este campo es obligatorio' } }}
                      />
                      <ErrorMessage name="descripcion" />
                    </div>
                    <div className="col-11 my-1">
                      <label htmlFor="permisos">Permisos: *</label>

                      <Controller
                        name="permisos"
                        render={({ field }) => (
                          <ListBox
                            filter
                            filterMatchMode="contains"
                            value={field.value}
                            options={catalogo?.data?.data?.permisos}
                            onChange={(e) => field.onChange(e.value)}
                            multiple
                          />
                        )}
                      />
                      <ErrorMessage name="permisos" />
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <div className="col-md-6 my-2">
                          <Button label="Regresar" block href="/auditoria/roles-sistema/" variant="info" />
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

FormRolSistemaPage.getInitialProps = ({ query }) => query as any;
FormRolSistemaPage.help ={
  title:'Formulario de registro de Roles del sistema',
  content:'Formulario de ingreso de datos de roles del sistema',
}

export default FormRolSistemaPage;
