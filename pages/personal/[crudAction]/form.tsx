import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCatalogoFormPersonal, urlCreatePersonal, urlUpdatePersonal } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const PersonalFormPage: NextPage<{ id?: string | number; crudAction: CrudActions }> = (props) => {
  const methods = useForm({ mode: 'onChange' });

  const queryCatalogo = useQuery<AxiosResponse<any>>(
    ['rolesPersonal'],
    () => API.private().get(urlCatalogoFormPersonal),
    {
      refetchOnWindowFocus: false,
    },
  );

  useQuery(['personal'], () => API.private().get(urlUpdatePersonal(props.id)), {
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
      create: urlCreatePersonal,
      editar: urlUpdatePersonal(id),
    }),
    [],
  );

  const mutation = useMutation((formData) => API.private()[method[crudAction]](url[crudAction], formData));

  const _onSubmit = async (formData) => {
    try {
      await mutation.mutateAsync(formData);
      console.log(formData);
      router.push('/personal');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <PrivateLayout title="Personal">
        <main className="container">
          <h1 className="text-center my-5">
            <Button outlined rounded href="/personal" icon={PrimeIcons.ARROW_LEFT} />
            Formulario del personal
          </h1>
          <div className="row justify-content-center">
            <div className="col-11 border">
              <div className="row justify-content-center">
                <div className="col-11">
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(_onSubmit)} className="row py-5">
                      <div className="col-md-6 my-5">
                        <label htmlFor="persona">Personal: *</label>
                        <DropDown
                          block
                          controller={{ name: 'persona', rules: { required: 'Este campo es obligatorio' } }}
                          options={queryCatalogo?.data?.data?.personas}
                          filter
                          filterMatchMode="contains"
                        />
                        <ErrorMessage name="persona" />
                      </div>
                      <div className="col-md-6 my-5">
                        <label htmlFor="rol">Rol: *</label>
                        <DropDown
                          block
                          controller={{ name: 'rol', rules: { required: 'Este campo es obligatorio' } }}
                          options={queryCatalogo?.data?.data?.roles}
                        />
                        <ErrorMessage name="rol" />
                      </div>

                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-6 my-2">
                            <Button
                              label="Regresar"
                              block
                              loading={mutation.isLoading}
                              href="/personal/"
                              variant="info"
                            />
                          </div>
                          <div className="col-md-6 my-2">
                            <Button
                              label="Guardar"
                              block
                              type="submit"
                              loading={mutation.isLoading}
                              onClick={methods.handleSubmit(_onSubmit)}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </main>
      </PrivateLayout>
    </FormProvider>
  );
};

PersonalFormPage.getInitialProps = ({ query }) => query as any;

export default PersonalFormPage;
