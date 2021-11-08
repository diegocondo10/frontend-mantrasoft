import Button from '@src/components/Button';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlConsultarHorarios, urlParametrosGeneracionHorario, urlUpdateOrCreateHorario } from '@src/services/urls';
import { generarFechasEntre } from '@src/utils/date';
import moment from 'moment';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

const GeneracionHorarioPage: NextPage<{ startDate: string; endDate: string }> = ({ startDate, endDate }) => {
  const fechas: any = useMemo(() => generarFechasEntre(moment(startDate), moment(endDate)), [startDate, endDate]);

  const [filas, setFilas] = useState([]);

  const query = useQuery(['parametros', endDate, startDate], () => API.private().get(urlParametrosGeneracionHorario));
  const queryHorarios = useQuery(
    ['horarios', startDate, endDate],
    () => API.private().get(urlConsultarHorarios(startDate, endDate)),
    {
      onSuccess: ({ data }) => {
        const items = [...data];
        const newData = data?.map((item, index) => ({
          ...item,
          dias: Object.values(fechas)
            .map((fecha: any) => fecha.dias)
            .flat()
            ?.map((dia) => {
              const diaOriginal = items[index]?.dias.find((obj) => obj.fecha == dia?.date);
              return { ...diaOriginal, ...dia, jornada: getJornada(diaOriginal?.jornada)?.value };
            }),
        }));
        setFilas(newData);
      },
    },
  );

  const jornadas: any[] = query?.data?.data?.jornadas;

  const getJornada = (id) => jornadas?.find((item) => item?.value?.id === id);

  const onChangeValue = ({ fila, indexFila, dia, indexDia }) => {
    return (evt) => {
      API.private().post(urlUpdateOrCreateHorario, {
        enfermeraId: fila?.id,
        fecha: dia?.date,
        jornadaId: evt.value?.id,
      });
      filas[indexFila].dias[indexDia] = {
        ...dia,
        jornada: evt.value,
      };
      setFilas([...filas]);
    };
  };

  const leftContents = (
    <React.Fragment>
      <Button label="Agregar" icon={PrimeIcons.PLUS} sm outlined className="p-mr-2" />
    </React.Fragment>
  );
  return (
    <PrivateLayout loading={{ loading: query.isLoading || queryHorarios.isLoading }}>
      <main className="container-fluid">
        <div className="row">
          <Toolbar left={leftContents} className="w-full" />
          <div className="col-12 p-0 m-0" style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-responsive-xl">
              <thead>
                <tr>
                  <th className="text-center align-vertical-middle" rowSpan={3}>
                    No.
                  </th>
                  <th className="text-center align-vertical-middle" rowSpan={3}>
                    Enfermera/o
                  </th>

                  {Object.entries(fechas).map(([key, value]: any) => (
                    <th className="text-center" colSpan={value?.dias?.length} key={`Mes.${key}`}>
                      {key}
                    </th>
                  ))}
                </tr>
                <tr>
                  {Object.entries(fechas).map(([key, value]: any) =>
                    value.dias.map((dia) => (
                      <th className="text-center" key={`DiasStr.${key}.${dia?.date}`}>
                        {dia?.str}
                      </th>
                    )),
                  )}
                </tr>
                <tr>
                  {Object.entries(fechas).map(([key, value]: any) =>
                    value.dias.map((dia) => (
                      <th className="text-center" key={`DiasNumber.${key}.${dia?.date}`}>
                        {dia?.number}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, index) => (
                  <React.Fragment key={fila.id}>
                    <tr className="text-center">
                      <th className="align-vertical-middle">{index + 1}</th>
                      <th className="align-vertical-middle p-0 m-0">{fila?.label}</th>
                      {fila?.dias?.map((dia, indexDia) => (
                        <th className="text-center p-0 m-0 align-vertical-middle" key={dia?.fecha}>
                          <Dropdown
                            className="p-inputtext-sm rounded-0 dropdown__horario w-100"
                            options={query?.data?.data?.jornadas}
                            panelClassName="p-0 m-0 dropdown__horario"
                            dataKey="id"
                            value={dia?.jornada}
                            dropdownIcon={null}
                            onChange={onChangeValue({ fila, indexFila: index, dia, indexDia })}
                            itemTemplate={(item) => (
                              <div
                                style={{ backgroundColor: item?.value?.color, color: item?.value?.colorLetra }}
                                className="w-full text-center px-0 py-2 font-bold"
                              >
                                {item?.label}
                              </div>
                            )}
                            valueTemplate={(item) => (
                              <div
                                style={{
                                  backgroundColor: item?.value?.color,
                                  color: item?.value?.colorLetra,
                                  height: '34.06px',
                                }}
                                className="w-full text-center font-bold d-flex flex-column justify-content-center border-0"
                              >
                                <span>{item?.label || 'SELEC'}</span>
                              </div>
                            )}
                          />
                        </th>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};

GeneracionHorarioPage.getInitialProps = ({ query }) => query as any;

export default GeneracionHorarioPage;
