import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import Loading from '@src/components/Loading';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlConsultarHorarios, urlParametrosGeneracionHorario, urlUpdateOrCreateHorario } from '@src/services/urls';
import { generarFechasEntre } from '@src/utils/date';
import moment from 'moment';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import React, { useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import ReactToPrint from 'react-to-print';

const HorariosPage: NextPage<any> = ({ start, end }) => {
  console.log(start, end);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      startDate: start,
      endDate: end,
    },
  });

  const [startDate, endDate]: any = methods.watch(['startDate', 'endDate']);

  const [filas, setFilas] = useState([]);

  const [fechas, setFechas] = useState({});
  const componentRef = useRef(null);

  const documentTitle = useMemo(
    () => `${moment(startDate).format('DD [de] MMMM [de] YYYY')} - ${moment(endDate).format('DD [de] MMMM [de] YYYY')}`,
    [startDate, endDate],
  );

  const query = useQuery(['parametros'], () => API.private().get(urlParametrosGeneracionHorario));
  const queryHorarios = useQuery(
    ['horarios', startDate, endDate],
    () => API.private().get(urlConsultarHorarios(startDate, endDate)),
    {
      enabled: false,
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
  const onClickConsultar = (formData) => {
    router.replace(`/horarios?start=${formData?.startDate}&end=${formData?.endDate}`);
    setFechas(generarFechasEntre(moment(formData?.startDate), moment(formData?.endDate)));
    queryHorarios.refetch();
  };
  const leftContents = (
    <React.Fragment>
      <ReactToPrint
        documentTitle={documentTitle}
        bodyClass="horizontal"
        trigger={() => <Button label="Imprimir" icon={PrimeIcons.PRINT} sm outlined className="p-mr-2" />}
        content={() => componentRef.current}
      />
    </React.Fragment>
  );

  return (
    <PrivateLayout title="Horarios">
      <main className="container-fluid">
        <h1 className="text-center my-5">Horarios</h1>
        <div className="row justify-content-center">
          <div className="col-11 md:col-8 lg:col-6 xl:col-5">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onClickConsultar)}>
                <div className="row justify-content-center">
                  <div className="col-12 md:col-6">
                    <div className="w-full">
                      <label htmlFor="startDate">Fecha de inicio:</label>
                      <input
                        className="form-control"
                        type="date"
                        name="startDate"
                        id="startDate"
                        disabled={queryHorarios.isFetching}
                        {...methods.register('startDate', {
                          onChange: () => {
                            methods.setValue('endDate', null);
                          },
                          validate: (value) => {
                            const momentDate = moment(value);
                            if (!momentDate.isValid()) {
                              return 'Ingrese una fecha válida';
                            }
                            return true;
                          },
                        })}
                      />
                      <ErrorMessage name="startDate" />
                    </div>
                  </div>
                  <div className="col-12 md:col-6">
                    <div className="w-full">
                      <label htmlFor="endDate">Fecha de fin:</label>
                      <input
                        className="form-control"
                        type="date"
                        name="endDate"
                        id="endDate"
                        {...methods.register('endDate', {
                          validate: (value) => {
                            const momentDate = moment(value);
                            if (!momentDate.isValid()) {
                              return 'Ingrese una fecha válida';
                            }
                            return true;
                          },
                        })}
                        min={moment(startDate).add(1, 'day')?.format('YYYY-MM-DD')}
                        max={moment(startDate).add(1, 'month').subtract(1, 'day')?.format('YYYY-MM-DD')}
                        disabled={queryHorarios.isFetching || !startDate}
                      />
                      <ErrorMessage name="endDate" />
                    </div>
                  </div>
                  <div className="col-12 md:col-6">
                    <Button 
                      label="Consultar" 
                      loading={queryHorarios.isFetching} 
                      sm 
                      outlined 
                      block 
                      type="submit" 
                      tooltip='Desplegar Horario'
                    />
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
        <Loading className="mt-5" loading={queryHorarios?.isFetching} texto="Consultando horario...">
          <div className="row">
            <div className="col-12 p-0 m-0 w-full">
              <Toolbar left={leftContents} className="w-full" />
            </div>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-12 p-0 m-0" style={{ overflowX: 'auto' }}>
              <div ref={componentRef} className="horizontal">
                <div className="d-print flex-row justify-content-center">
                  <h4 className="my-5 text-center">Horario: {documentTitle}</h4>
                </div>
                <table className="table table-bordered table-responsive-xl">
                  <thead>
                    <tr>
                      <th className="text-center align-vertical-middle" rowSpan={3}>
                        No.
                      </th>
                      <th className="text-center align-vertical-middle" rowSpan={3}>
                        <i className={PrimeIcons.COG} />
                      </th>
                      <th className="text-center align-vertical-middle" rowSpan={3} style={{ minWidth: '200px' }}>
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
                          <th className="align-vertical-middle p-0 m-0">
                            <ButtonMenu
                              sm
                              outlined
                              block
                              icon={PrimeIcons.COG}
                              text
                              className="rounded-0"
                              items={[
                                {
                                  icon: PrimeIcons.INFO_CIRCLE,
                                  label: 'Ver detalle',
                                  command: () => {
                                    router.push(
                                      `/horarios/detalle?id=${fila.id}&startDate=${startDate}&endDate=${endDate}`,
                                    );
                                  },
                                },
                              ]}
                            />
                          </th>
                          <th className="align-vertical-middle p-0 m-0" style={{ fontSize: '12px' }}>
                            {fila?.label}
                          </th>
                          {fila?.dias?.map((dia, indexDia) => (
                            <th className="text-center p-0 m-0 align-vertical-middle" key={dia?.fecha}>
                              <Dropdown
                                className="p-inputtext-sm rounded-0 dropdown__horario w-100"
                                options={query?.data?.data?.jornadas}
                                placeholder="SELECCIONAR"
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
                                    <span>{item?.label || ''}</span>
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
          </div>
        </Loading>
      </main>
    </PrivateLayout>
  );
};
HorariosPage.getInitialProps = ({ query }) => query as any;
HorariosPage.help = {
  title:'Dashboard de generación de horarios',
  content:'Permite generar el horario laboral',
}
export default HorariosPage;
