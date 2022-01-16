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
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

const TramientoInicialPage: NextPage<{ idFicha: string }> = ({ idFicha }) => {
  const [guardando, setGuardando] = useState(false);

  const methods = useForm({ mode: 'onChange' });

  const query = useQuery(['INICIAL', idFicha], () => API.private().get(urlGetTratamientoInicial(idFicha)), {
    refetchOnWindowFocus: false,
    onSuccess: ({ data }) => {
      methods.reset({
        ...data?.tratamiento,
        inicio: formatearFechaFronend(data?.tratamiento?.inicio),
      });
    },
  });

  const onSubmit = async (formData) => {
    try {
      setGuardando(true);
      formData.inicio = formatearFechaBackend(formData.inicio);
      formData.pacienteId = formData.paciente.id;
      formData.medicamentos = formData.medicamentos.map((item) => ({
        ...item,
        medicamentoId: item.medicamento.value,
        medicamento: undefined,
        uuid: undefined,
        id: undefined,
      }));
      formData.paciente = undefined;

      await API.private().put(urlCreateOrUpdateTratamientoInicial(idFicha), formData);
      alert('Se ha guardado la información');
    } catch (error) {
      alert('Ha ocurrido un problema al guardar la información');
    }
    setGuardando(false);
  };

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
                  <div className="col-12 col-md-6">
                    <label htmlFor="inicio">Fecha de inicio: *</label>
                    <DateInput controller={{ name: 'inicio', rules: { required: 'Obligatorio' } }} block />
                    <ErrorMessage name="inicio" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="diagnostico">Diagnostico: *</label>
                    <TextArea
                      rows={10}
                      controller={{ name: 'diagnostico', rules: { required: 'Obligatorio' } }}
                      block
                    />
                    <ErrorMessage name="diagnostico" />
                  </div>

                  <Controller
                    name="medicamentos"
                    defaultValue={[]}
                    render={({ field, fieldState }: any) => (
                      <Medicamentos
                        medicamentos={query?.data?.data?.medicamentosDisponibles || []}
                        frecuencias={query?.data?.data?.frecuencias || []}
                        {...field}
                        {...fieldState}
                      />
                    )}
                  />

                  <div className="col-12"></div>

                  <div className="col-12">
                    <div className="row justify-content-center">
                      <div className="col-md-5">
                        <Button loading={guardando} type="submit" label="Guardar" block outlined />
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
