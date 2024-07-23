import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { CrudActions } from '@src/emuns/crudActions';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCreateMedicamento, urlDetailMedicamento, urlUpdateMedicamento } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { useRouter } from 'next/dist/client/router';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FormMedicamentosPage: CustomNextPage<any> = ({ crudAction, id }) => {
  const methods = useForm({ mode: 'onChange', shouldUnregister: true });
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

  const createMutation = useMutation<any>((formData: any) => API.private().post(urlCreateMedicamento, formData));

  const _onSubmit = async (formData) => {
    try {
      let res: AxiosResponse = null;

      if (CrudActions.CREATE === crudAction) {
        res = await createMutation.mutateAsync(formData);
      } else if (CrudActions.UPDATE === crudAction) {
        res = await updateMutation.mutateAsync(formData);
      }
      if (res.status === 201 || res.status === 200) {
        router.push('/medicamentos');
      }
    } catch (error) {
      addErrorToast('Ha ocurrido un problema al guardar la información');
    }
  };

  return (
    <FormProvider {...methods}>
      <PrivateLayout
        loading={{
          loading: query.isLoading || createMutation.isLoading || updateMutation.isLoading,
        }}
        breadCrumbItems={[
          {
            label: 'Medicamentos',
            command: commandPush('/medicamentos'),
          },
          {
            label: 'Formulario de medicamento',
          },
        ]}
      >
        <main className="grid grid-nogutter justify-content-center my-5">
          <div className="col-12 text-center">
            <p className="text-5xl text-gray-600">
              {crudAction === CrudActions.UPDATE && 'Editar medicamento'}
              {crudAction === CrudActions.CREATE && 'Crear medicamento'}
            </p>
          </div>
          <div className="col-11 md:col-8 lg:col-6 border-1 border-gray-300">
            <div className="p-7">
              <form onSubmit={methods.handleSubmit(_onSubmit)} className="grid justify-content-around">
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
                  <label htmlFor="descripcion">Descripción: *</label>
                  <Controller
                    name="descripcion"
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id="descripcion"
                        {...field}
                        autoResize
                        rows={5}
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                      />
                    )}
                  />
                </div>

                <div className="col-12 md:col-6">
                  <label htmlFor="via">Via: *</label>
                  <Controller
                    name="via"
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="via"
                        {...field}
                        placeholder="Seleccione"
                        options={['VO', 'VR', 'VI']}
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                        inputRef={field.ref}
                      />
                    )}
                  />
                  <ErrorMessage name="via" />
                </div>
                <div className="col-12 md:col-6">
                  <label htmlFor="via">Variante: *</label>
                  <Controller
                    name="variante"
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        inputId="variante"
                        {...field}
                        placeholder="Seleccione"
                        options={['TABLETA', 'GOTAS', 'INYECTABLE']}
                        className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                        inputRef={field.ref}
                      />
                    )}
                  />
                  <ErrorMessage name="variante" />
                </div>

                <div className="col-10 grid grid-nogutter justify-content-between">
                  <div className="col-12 md:col-5 my-2">
                    <Button label="Regresar" block href="/medicamentos" variant="info" outlined />
                  </div>
                  <div className="col-12 md:col-5 my-2">
                    <Button label="Guardar" block type="submit" outlined />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </PrivateLayout>
    </FormProvider>
  );
};

FormMedicamentosPage.getInitialProps = ({ query }) => query;
FormMedicamentosPage.help = {
  title: 'Formulario de registros de datos de medicamentos',
  content: 'Formulario de ingreso de datos para medicamentos',
};

export default FormMedicamentosPage;
