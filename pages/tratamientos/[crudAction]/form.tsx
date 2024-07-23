import Button from '@src/components/Button';
import DateInput from '@src/components/Forms/DateInput';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import { REQUIRED_RULE } from '@src/constants/rules';
import FormMedicamentos from '@src/containers/tratamientos/FormMedicamentos';
import {
  urlCrearTratamiento,
  urlEditarTratamiento,
  urlFrecuencias,
  urlMedicamentos,
  urlTratamiento,
} from '@src/containers/tratamientos/urls';
import { CrudActions } from '@src/emuns/crudActions';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { CustomNextPage } from '@src/types/next';
import { toBackDate, toFrontDate } from '@src/utils/date';
import { commandPush } from '@src/utils/router';
import Router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const FormTratamientoPage: CustomNextPage<any> = ({ id, idFicha, back, crudAction }) => {
  const methods = useForm({ mode: 'onChange' });

  const queryCatalogo = useQuery(
    ['catalogo-tratamientos'],
    () => Promise.all([API.private().get(urlMedicamentos), API.private().get(urlFrecuencias)]),
    {
      onError: () => Router.replace(back),
      refetchOnWindowFocus: false,
    },
  );

  const mutationOperation = useMemo(() => {
    if (crudAction === CrudActions.CREATE) {
      return (formData) => API.private().post(urlCrearTratamiento, formData);
    }
    return (formData) => API.private().put(urlEditarTratamiento(id), formData);
  }, [crudAction, id]);

  const mutation = useMutation((formData) => mutationOperation(formData));

  const queryTratamiento = useQuery<any>(['tratamiento', id, back], () => API.private().get(urlTratamiento(id)), {
    enabled: crudAction === CrudActions.UPDATE,
    refetchOnWindowFocus: false,
    onError: () => Router.replace(back),
    onSuccess: (res) => {
      methods.reset({
        ...res.data,
        fechaInicio: toFrontDate(res?.data?.fechaInicio),
        fechaFin: toFrontDate(res?.data?.fechaFin),
      });
    },
  });

  const onSubmit = async (data) => {
    const formData: any = {
      diagnostico: data.diagnostico,
      paciente: idFicha,
      fechaInicio: toBackDate(data.fechaInicio),
      fechaFin: toBackDate(data.fechaFin),
      medicamentos: data?.medicamentos?.map((item) => ({
        medicamento: item.medicamento.value,
        frecuencia: item.frecuencia,
        horas: item.horas,
      })),
    };
    await mutation.mutateAsync(formData);
    Router.push(back);
  };

  return (
    <FormProvider {...methods}>
      <PrivateLayout
        loading={{
          loading: queryCatalogo.isLoading || queryTratamiento.isLoading || mutation.isLoading,
        }}
        breadCrumbItems={[
          {
            label: 'Fichas de ingreso',
            command: commandPush('/fichas/ingreso'),
          },
          {
            label: 'Tratamientos',
            command: commandPush(back),
          },
          {
            label: 'Formulario de tratamiento',
          },
        ]}
      >
        <main className="grid grid-nogutter justify-content-center my-5">
          <div className="col-12 text-center">
            <h1>Tratamiento</h1>
          </div>
          <div className="col-11 lg:col-10 xl:col-8 border-1 border-gray-200 p-5">
            <form onSubmit={methods.handleSubmit(onSubmit)} className="formgrid grid p-5">
              <div className="field col">
                <label htmlFor="fechaInicio">Fecha de inicio:*</label>
                <DateInput
                  block
                  inputId="fechaInicio"
                  controller={{
                    name: 'fechaInicio',
                    rules: { ...REQUIRED_RULE },
                  }}
                />
                <ErrorMessage name="fechaInicio" />
              </div>
              <div className="field col">
                <label htmlFor="fechaFin">Fecha de fin:*</label>
                <DateInput
                  block
                  inputId="fechaFin"
                  controller={{
                    name: 'fechaFin',
                    rules: { ...REQUIRED_RULE },
                  }}
                />
                <ErrorMessage name="fechaFin" />
              </div>
              <div className="field col-12">
                <label htmlFor="diagnostico">Diagnostico:*</label>
                <TextArea
                  id="diagnostico"
                  block
                  rows={7}
                  controller={{ name: 'diagnostico', rules: { ...REQUIRED_RULE } }}
                />
                <ErrorMessage name="diagnostico" />
              </div>

              <div className="field col-12">
                <Controller
                  name="medicamentos"
                  defaultValue={[]}
                  render={({ field }) => (
                    <DataTable
                      dataKey="uuid"
                      showGridlines
                      value={field.value}
                      emptyMessage="No se han registrado medicamentos para este tratamiento"
                      header={
                        <div className="d-flex flex-row">
                          <span className="p-inputgroup w-full">
                            <FormMedicamentos
                              medicamentos={queryCatalogo?.data?.[0]?.data}
                              frecuencias={queryCatalogo?.data?.[1]?.data}
                            />
                          </span>
                        </div>
                      }
                    >
                      {ColumnaNo()}
                      <Column header="Medicamento" field="medicamento.label" />
                      <Column className="text-center" header="Frecuencia" field="frecuencia" />
                      <Column
                        header="Horas"
                        field="horas"
                        body={(rowData) =>
                          rowData?.horas?.map((hora) => (
                            <div className="flex flex-column text-center" key={`${rowData.uuid}-${hora}`}>
                              <strong>{hora}</strong>
                            </div>
                          ))
                        }
                      />
                      <Column
                        className="p-0 m-0 text-center"
                        header={<i className={PrimeIcons.TRASH} />}
                        body={(rowData) => (
                          <Button
                            variant="danger"
                            outlined
                            icon={PrimeIcons.TRASH}
                            onClick={() => {
                              const newItems = field.value?.filter((item) => item.uuid !== rowData.uuid);
                              field.onChange(newItems);
                            }}
                          />
                        )}
                      />
                    </DataTable>
                  )}
                />
              </div>

              <div className="field col-12 grid justify-content-center mt-5">
                <div className="col-6">
                  <Button variant="info" label="Regresar" block href={back} />
                </div>
                <div className="col-6">
                  <Button type="submit" label="Guardar" block />
                </div>
              </div>
            </form>
          </div>
        </main>
      </PrivateLayout>
    </FormProvider>
  );
};

FormTratamientoPage.getInitialProps = ({ query }) => query;

export default FormTratamientoPage;
