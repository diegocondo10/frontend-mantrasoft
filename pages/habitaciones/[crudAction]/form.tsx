import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { CrudActions } from '@src/emuns/crudActions';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import {
  urlCreateHabitacion,
  urlDetailHabitacion,
  urlListarAlasLabelValueHabitaciones,
  urlUpdateHabitacion,
} from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { useRouter } from 'next/dist/client/router';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const HabitacionFormPage: CustomNextPage<{ crudAction: CrudActions; id?: string | number }> = ({ crudAction, id }) => {
  const methods = useForm({ mode: 'onChange' });
  const router = useRouter();
  const { addErrorToast } = useToasts();
  const queryAlas = useQuery(['alas', crudAction, id], () => API.private().get(urlListarAlasLabelValueHabitaciones));

  const query = useQuery(['habitacion', CrudActions, id], () => API.private().get(urlDetailHabitacion(id)), {
    enabled: crudAction === CrudActions.UPDATE,
    onSuccess(data) {
      console.log(data?.data);
      methods.reset({ ...data?.data });
    },
    onError(err) {
      addErrorToast('No se ha podido encontrar el registro');
      router.push('/habitaciones');
    },
  });

  const updateMutation = useMutation<any>((formData: any) => API.private().put(urlUpdateHabitacion(id), formData));

  const createMutation = useMutation<any>((formData: any) => API.private().post(urlCreateHabitacion, formData));

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

  return (
    <PrivateLayout
      loading={{
        loading: query.isLoading || createMutation.isLoading || updateMutation.isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Habitaciones',
          command: commandPush('/habitaciones'),
        },
        {
          label: 'Formulario de habitaciones',
        },
      ]}
    >
      <main className="grid grid-nogutter justify-content-center my-5">
        <div className="col-12 text-center">
          <p className="text-5xl text-gray-600">
            {crudAction === CrudActions.UPDATE && 'Editar habitación'}
            {crudAction === CrudActions.CREATE && 'Crear habitación'}
          </p>
        </div>
        <div className="col-11 md:col-8 lg:col-6 xl:col-5 border-1 border-gray-300">
          <div className="p-6">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(_onSubmit)} className="grid justify-content-around">
                <div className="field col-12 my-2">
                  <label htmlFor="ala">Ala: *</label>
                  <Controller
                    name="ala"
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="ala"
                        options={queryAlas?.data?.data || []}
                        {...field}
                        placeholder="Seleccione"
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="ala" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label>N° de Habitación: *</label>
                  <Controller
                    name="numero"
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id="numero"
                        {...field}
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="numero" />
                </div>
                <div className="field col-12 md:col-6 my-2">
                  <label>Capacidad: *</label>
                  <Controller
                    name="capacidadPacientes"
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id="capacidadPacientes"
                        {...field}
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                  <ErrorMessage name="capacidadPacientes" />
                </div>

                <div className="col-10 grid grid-nogutter justify-content-between">
                  <div className="col-12 md:col-5 my-2">
                    <Button outlined label="Regresar" block href="/habitaciones" variant="info" />
                  </div>
                  <div className="col-12 md:col-5 my-2">
                    <Button outlined label="Guardar" block type="submit" onClick={methods.handleSubmit(_onSubmit)} />
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};

HabitacionFormPage.getInitialProps = ({ query }) => query as any;
HabitacionFormPage.help = {
  title: 'Formulario de registro de habitación',
  content: 'Formulario de ingreso de datos de habitaciones',
};

HabitacionFormPage.isPrivate = true;

export default HabitacionFormPage;
