import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { CrudActions } from '@src/emuns/crudActions';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDetailMedicamento, urlUpdateMedicamento } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FormMedicamentosPage: NextPage<any> = ({ crudAction, id }) => {
  const methods = useForm({ mode: 'onChange' });
  const router = useRouter();
  const { addErrorToast } = useToasts();
  const query = useQuery(['medicamento', crudAction, id], () => API.private().get(urlDetailMedicamento(id)), {
    enabled: crudAction === CrudActions.UPDATE,
    onSuccess(data) {
      methods.reset(data?.data);
    },
    onError(err) {
      addErrorToast('No se ha podido encontrar el registro');
      router.push('/medicamentos');
    },
  });

  const updateMutation = useMutation<any>((formData: any) => API.private().put(urlUpdateMedicamento(id), formData));

  const createMutation = useMutation<any>((formData: any) => API.private().post(formData));

  const _onSubmit = async (formData) => {
    let res: AxiosResponse = null;

    if (CrudActions.CREATE === crudAction) {
      res = await createMutation.mutateAsync(formData);
    } else if (CrudActions.UPDATE === crudAction) {
      res = await updateMutation.mutateAsync(formData);
    }
    if (res.status === 201 || res.status === 200) {
      router.push('/medicamentos');
    }
  };

  return (
    <PrivateLayout
      loading={{
        loading: query.isLoading || createMutation.isLoading || updateMutation.isLoading,
      }}
    >
      <main className="container-fluid">
        <div className="d-flex flex-row my-3 justify-content-center">
          <div className="align-self-center">
            <Button href="/medicamentos" sm rounded icon={PrimeIcons.ARROW_LEFT} outlined />
          </div>
          {CrudActions.CREATE === crudAction && (
            <h3 className="text-center align-self-center">Registro de información</h3>
          )}
          {CrudActions.UPDATE === crudAction && <h3 className="text-center align-self-center">Editar información</h3>}
        </div>
        <FormProvider {...methods}>
          <div className="row justify-content-center">
            <div className="col-11 border">
              <div className="row justify-content-center">
                <div className="col-11">
                  <form onSubmit={methods.handleSubmit(_onSubmit)} className="row">
                    <div className="col-12">
                      <label htmlFor="nombre">Nombre: *</label>
                      <Controller
                        name="nombre"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="nombre"
                            {...field}
                            placeholder="Nombre del medicamento"
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="nombre" />
                    </div>

                    <div className="col-12">
                      <label htmlFor="nombre">Via: *</label>
                      <Controller
                        name="via"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            id="via"
                            {...field}
                            placeholder="Seleccione"
                            options={['VO', 'VA']}
                            showClear
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="via" />
                    </div>
                    <div className="col-12">
                      <label htmlFor="descripcion">Descripción: *</label>
                      <Controller
                        name="descripcion"
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            id="descripcion"
                            {...field}
                            autoResize
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                    </div>

                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-6">
                            <Button label="Regresar" block href="/medicamentos" variant="info" />
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
        </FormProvider>
      </main>
    </PrivateLayout>
  );
};

FormMedicamentosPage.getInitialProps = ({ query }) => query;

export default FormMedicamentosPage;
