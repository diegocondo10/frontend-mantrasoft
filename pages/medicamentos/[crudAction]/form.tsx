import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { REQUIRED_RULE } from '@src/constants/rules';
import { CrudActions } from '@src/emuns/crudActions';
import useCreateUpdate from '@src/hooks/useCreateUpdate';
import { useParametros } from '@src/hooks/useParametros';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { MedicamentoService } from '@src/services/medicamento/medicamento.service';
import { PARAMETROS } from '@src/services/parametro/parametro.enum';
import { urlDetailMedicamento } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import classNames from 'classnames';
import Router from 'next/router';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

const FormMedicamentosPage: CustomNextPage<any> = ({ crudAction, id }) => {
  const methods = useForm({ mode: 'onChange', shouldUnregister: true });

  const queryParametros = useParametros({
    codigos: [PARAMETROS.MEDICACION_VIAS, PARAMETROS.MEDICACION_VARIANTES],
  });

  const query = useQuery(['medicamento', crudAction, id], () => API.private().get(urlDetailMedicamento(id)), {
    enabled: crudAction === CrudActions.UPDATE,
    onSuccess(data) {
      methods.reset(data?.data);
    },
  });

  const mutation = useCreateUpdate({
    action: crudAction,
    methods,
    create: (formData) => new MedicamentoService().create(formData),
    update: (formData) => new MedicamentoService().update(id, formData),
    onSuccess: () => {
      Router.push('/medicamentos');
    },
  });

  const _onSubmit = async (formData) => {
    mutation.submitForm(formData);
  };

  return (
    <FormProvider {...methods}>
      <PrivateLayout
        loading={{
          loading: query.isLoading || mutation.isLoading,
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
                <div className="field col-12">
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

                <div className="field col-12">
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

                <div className="field col-12 md:col-6">
                  <label htmlFor="via">Via: *</label>
                  <DropDown
                    inputId="via"
                    block
                    options={queryParametros.data?.MEDICACION_VIAS}
                    controller={{
                      name: 'via',
                      rules: {
                        ...REQUIRED_RULE,
                      },
                    }}
                  />
                  <ErrorMessage name="via" />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="via">Variante: *</label>
                  <DropDown
                    inputId="variante"
                    block
                    options={queryParametros.data?.MEDICACION_VARIANTES}
                    controller={{
                      name: 'variante',
                      rules: {
                        ...REQUIRED_RULE,
                      },
                    }}
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

FormMedicamentosPage.isPrivate = true;

export default FormMedicamentosPage;
