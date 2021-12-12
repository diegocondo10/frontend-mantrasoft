import Button from '@src/components/Button';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import {
  urlImprimirReporteSignosVitalesSemana,
  urlInfoPacienteByIdFicha,
  urlSignosPorSemana,
} from '@src/services/urls';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

const SignosVitalesPage: NextPage<{ id: any }> = ({ id }) => {
  const query = useQuery(['info-paciente', id], () => API.private().get(urlInfoPacienteByIdFicha(id)), {
    enabled: id !== undefined,
  });
  const [week, setWeek] = useState('');

  const queryData = useQuery(['infoSemana', id, week], () => API.private().get(urlSignosPorSemana(week, id)), {
    enabled: week !== '',
  });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setWeek(evt.target.value);
  };

  return (
    <PrivateLayout title="Signos vitales">
      <main className="container-fluid mb-5">
        <div className="row">
          <div className="col-12">
            <div className="text-center d-flex flex-row justify-content-center">
              <div className="align-self-center">
                <Button icon={PrimeIcons.ARROW_LEFT} outlined rounded href="/fichas/ingreso" />
              </div>
              <div>
                <h1>Registro de signos vitales</h1>
                <h3>{query?.data?.data?.persona?.display}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5 justify-content-center g-1 align-items-center">
          <div className="col-auto">
            <label htmlFor="semana">
              <h3>Buscar Registros:</h3>
            </label>
          </div>
          <div className="col-auto">
            <input value={week} onChange={onChange} className="form-control form-control-lg" type="week" />
          </div>
          {queryData?.data?.data?.['pulsoX'].length > 0 && queryData?.data?.data?.['tempX'].length > 0 && (
            <div className="col-auto">
              <Button
                label="Imprimir"
                block
                outlined
                variant="info"
                icon={PrimeIcons.PRINT}
                onClick={API.getReporte(urlImprimirReporteSignosVitalesSemana(week, id))}
              />
            </div>
          )}
        </div>

        {queryData.isFetching && (
          <div className="text-center my-5">
            <ProgressSpinner />
            <h3>Consultando...</h3>
          </div>
        )}

        {!queryData?.isFetching &&
          queryData?.data?.data?.['pulsoX'].length === 0 &&
          queryData?.data?.data?.['tempX'].length == 0 && (
            <h3 className="text-center my-8 text-danger">No se ha encontrado información</h3>
          )}

        {!queryData.isFetching && (
          <div className="row mt-3">
            {queryData?.data?.data?.['pulsoX'].length > 0 && (
              <div className="col-12 xl:col-6">
                <Chart
                  type="line"
                  data={{
                    labels: queryData?.data?.data?.['pulsoX'],
                    datasets: [
                      {
                        label: 'Pulso',
                        data: queryData?.data?.data?.['pulsoY'],
                        fill: false,
                        borderColor: '#b61921',
                      },
                    ],
                  }}
                />
              </div>
            )}
            {queryData?.data?.data?.['tempX'].length > 0 && (
              <div className="col-12 xl:col-6">
                <Chart
                  type="line"
                  data={{
                    labels: queryData?.data?.data?.['tempX'],
                    datasets: [
                      {
                        label: 'Temperatura',
                        data: queryData?.data?.data?.['tempY'],
                        fill: false,
                        borderColor: '#0d5ed8',
                      },
                    ],
                  }}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </PrivateLayout>
  );
};

SignosVitalesPage.getInitialProps = ({ query }) => query as any;

export default SignosVitalesPage;
