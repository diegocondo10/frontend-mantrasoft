import Button from '@src/components/Button';
import DateInput from '@src/components/Forms/DateInput';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import Medicamentos from '@src/containers/tratamientos/medicamentos';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCreateOrUpdateTratamientoInicial, urlGetTratamientoInicial } from '@src/services/urls';
import { formatearFechaBackend, formatearFechaFronend } from '@src/utils/date';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

const TramientoInicialPage: NextPage<{ idFicha: string }> = ({ idFicha }) => {
  console.log(idFicha);

  const methods = useForm({ mode: 'onChange' });

  const query = useQuery(['INICIAL', idFicha], () => API.private().get(urlGetTratamientoInicial(idFicha)), {
    refetchOnWindowFocus: false,
    onSuccess: ({ data }) => {
      console.log({
        ...data,
        inicio: formatearFechaFronend(data?.inicio),
        fin: formatearFechaFronend(data?.fin),
      });
      methods.reset({
        ...data,
        inicio: formatearFechaFronend(data?.inicio),
        fin: formatearFechaFronend(data?.fin),
      });
    },
  });

  const onSubmit = async (formData) => {
    console.log(formData);
    formData.inicio = formatearFechaBackend(formData.inicio);
    formData.fin = formatearFechaBackend(formData.fin);
    const res = await API.private().post(urlCreateOrUpdateTratamientoInicial(idFicha), formData);
    console.log(res);
  };
  console.log(query?.data?.data);
  return (
    <FormProvider {...methods}>
      <PrivateLayout loading={{ loading: query.isFetching }}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <main className="container-fluid">
            <h1 className="text-center my-5">
              <Button outlined rounded icon={PrimeIcons.ARROW_LEFT} />
              Tratamiento inicial
            </h1>
            <div className="row justify-content-center">
              <div className="col-12 md:col-11 border p-5">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="inicio">Diagnostico inicial: *</label>
                    <DateInput controller={{ name: 'inicio', rules: { required: 'Obligatorio' } }} block />
                    <ErrorMessage name="inicio" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="fin">Diagnostico inicial: *</label>
                    <DateInput controller={{ name: 'fin', rules: { required: 'Obligatorio' } }} block />
                    <ErrorMessage name="fin" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="diagnosticoInicial">Diagnostico inicial: *</label>
                    <TextArea
                      rows={10}
                      controller={{ name: 'diagnosticoInicial', rules: { required: 'Obligatorio' } }}
                      block
                    />
                    <ErrorMessage name="diagnosticoInicial" />
                  </div>

                  <Controller
                    name="medicamentos"
                    defaultValue={{}}
                    render={({ field, fieldState }: any) => (
                      <Medicamentos
                        medicamentos={query?.data?.data?.medicamentosDisponibles || []}
                        {...field}
                        {...fieldState}
                      />
                    )}
                  />

                  <div className="col-12"></div>

                  <div className="col-12">
                    <div className="row justify-content-center">
                      <div className="col-md-5">
                        <Button type="submit" label="Guardar" block outlined />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </form>
      </PrivateLayout>
    </FormProvider>
  );
};

TramientoInicialPage.getInitialProps = ({ query }) => query as any;

export default TramientoInicialPage;
