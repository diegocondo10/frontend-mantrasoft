import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { CrudActions } from '@src/emuns/crudActions';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDetailHabitacion, urlUpdateHabitacion } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';


const HabitacionFormPage: NextPage<any> = ( crudAction, id) => {

  const methods = useForm({ mode: 'onChange' });
  const router = useRouter();
  const { addErrorToast } = useToasts();
  const query = useQuery(['habitacion', CrudActions, id], () => API.private().get(urlDetailHabitacion(id)), {
    enabled: crudAction === CrudActions.UPDATE,
    onSuccess(data) {
      methods.reset(data?.data);
    },
    onError(err) {
      addErrorToast('No se ha podido encontrar el registro');
      router.push('/habitaciones');
    },
  });

  const updateMutation = useMutation<any>((formData: any) => API.private().put(urlUpdateHabitacion(id), formData));

  const createMutation = useMutation<any>((formData: any) => API.private().post(formData));

  const _onSubmit = async (formData) => {
    let res: AxiosResponse = null;

    if (CrudActions.CREATE === crudAction) {
      res = await createMutation.mutateAsync(formData);
    } else if (CrudActions.UPDATE === crudAction) {
      res = await updateMutation.mutateAsync(formData);
    }
    if (res.status === 201 || res.status === 200) {
      router.push('/habitaciones');
    }
  };
  

  return(
    <PrivateLayout loading={{
      loading: query.isLoading || createMutation.isLoading || updateMutation.isLoading,
    }}>
      <main className="container-fluid">
        <div className="d-flex flex-row my-3 justify-content-center">
          <div className="align-self-center">
            <Button href="/habitaciones/" sm rounded icon={PrimeIcons.ARROW_LEFT} outlined />
          </div>
          {CrudActions.CREATE === crudAction && (
            <h3 className="text-center align-self-center">Registro de información</h3>
          )}
          {CrudActions.UPDATE === crudAction && <h3 className="text-center align-self-center">Editar información</h3>}
        </div>

        <div className="row justify-content-center">
          <div className="col-11 border">
            <div className="row justify-content-center">
              <div className="col-11">
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(_onSubmit)} className="row">
                    <div className="col-md-6">
                      <label htmlFor="ala">Ala: *</label>
                      <Controller
                        name="ala"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            inputId="ala"
                            options={['1', '2']}
                            {...field}
                            showClear
                            placeholder="Seleccione"
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="ala" />
                    </div>
                    <div className="col-md-6">
                      <label>N° de Habitación: *</label>
                      <Controller
                        name="numeroHabitacion"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="numeroHabitacion"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="numeroHabitacion" />
                    </div>
                    <div className="col-md-6">
                      <label>Capacidad: *</label>
                      <Controller
                        name="capacidad"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id="capacidad"
                            {...field}
                            className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                          />
                        )}
                      />
                      <ErrorMessage name="capacidad" />
                    </div>
                              
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-6">
                            <Button label="Regresar" block href="/habitaciones/" variant="info" />
                          </div>
                          <div className="col-md-6">
                            <Button label="Guardar" block type="submit" />
                          </div>
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

  );




  


};

export default HabitacionFormPage;
