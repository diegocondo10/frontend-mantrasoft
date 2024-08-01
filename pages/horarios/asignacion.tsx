import JornadasDialog from '@src/containers/horarios/AsignacionHorarios/components/JornadasDialog';
import { urlEnfermeras, urlHorarioByDate, urlJornadas } from '@src/containers/horarios/urls';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { HorarioService } from '@src/services/horarios/Horario.service';
import { CustomNextPage } from '@src/types/next';
import { format, parse } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useQuery } from 'react-query';

interface AsignacionHorarionsPageProps {
  q: string | null;
}

interface Enfermera {
  value: number;
  label: string;
}

interface Jornada {
  id: string;
  codigo: string;
  color: string;
  colorLetra: string;
}

interface Filas {
  [key: string]: { value: string };
}

const buildStringDate = (date: Date): string => date.toISOString().split('T')[0];
const getDayInitial = (date: Date): string => {
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  return days[date.getDay()];
};

const getDiasDelMes = (selectedDate: Date) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

const AsignacionHorarionsPage: CustomNextPage<AsignacionHorarionsPageProps> = ({ q }) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(parse(q, 'yyyy-MM-dd', new Date()));

  const [enfermeras, setEnfermeras] = useState<Enfermera[]>([]);

  const [jornadas, setJornadas] = useState<Jornada[]>([]);

  const [jornadasIndex, setJornadasIndex] = useState<Record<number, Jornada>>({});

  const [filas, setFilas] = useState<Filas>({});

  const diasDelMes = useMemo<Date[]>(() => getDiasDelMes(selectedDate), [selectedDate]);

  const queryCatalogos = useQuery(
    ['catalogos-horarios-asignacion'],
    ({ signal }) =>
      Promise.all([API.private().get(urlEnfermeras, { signal }), API.private().get(urlJornadas, { signal })]),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        setEnfermeras(response[0].data);
        setJornadas(response[1].data);
        setJornadasIndex(
          response[1].data.reduce((obj, item) => {
            obj[item.id] = item;
            return obj;
          }, {}),
        );
      },
    },
  );

  const queryAsignaciones = useQuery(
    ['asignaciones', q],

    ({ signal }) => API.private().post(urlHorarioByDate, { fecha: q }, { signal }),
    {
      enabled: !!q,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }) => {
        setFilas(data);
      },
      cacheTime: 0,
    },
  );

  const onSelectDate = (date: Date) => {
    router.replace({
      pathname: router.pathname,
      query: {
        q: buildStringDate(date),
      },
    });
    setSelectedDate(date);
  };

  const onChangeValue = (rowData: Enfermera, day: Date) => (event: DropdownChangeEvent) => {
    const fechaString = buildStringDate(day);
    const key = `${rowData.value}--${fechaString}`;
    new HorarioService().asignar(rowData.value, event.value.id, fechaString);
    setFilas({
      ...filas,
      [key]: {
        value: event.value.id,
      },
    });
  };

  return (
    <PrivateLayout
      loading={{
        loading: queryCatalogos.isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Asignación de horarios',
        },
        {
          label: format(selectedDate, "MMMM 'de' yyyy"),
        },
      ]}
    >
      <main className="grid grid-nogutter justify-content-center">
        <div className="col-11 md:col-5 border-1 border-gray-200 text-center my-4 p-5">
          <div className="max-w-19rem mx-auto">
            <div className="flex flex-column">
              <label className="my-2 font-semibold" htmlFor="fecha">
                Seleccione:
              </label>
              <DatePicker
                id="fecha"
                selected={selectedDate}
                onChange={onSelectDate}
                showMonthYearPicker
                locale="es"
                className="p-inputtext p-component font-semibold text-center uppercase"
                calendarClassName="p-input"
                dateFormat="MMMM/yyyy"
                renderMonthContent={(_, fullMonthText) => <p className="uppercase">{fullMonthText}</p>}
                portalId="root-portal"
                disabled={queryAsignaciones.isLoading}
              />
              <p className="mt-3">
                Seleccione una fecha para visualizar y asignar los horarios de las enfermeras.
                <JornadasDialog jornadas={jornadas} />
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 border-1 border-gray-200">
          <DataTable
            value={enfermeras}
            scrollable
            scrollHeight="400px"
            showGridlines
            frozenWidth="200px"
            className="p-datatable-frozen"
            loading={queryAsignaciones.isLoading}
          >
            <Column
              header="No"
              className="p-0 m-0 text-center font-bold"
              style={{ zIndex: 1 }}
              frozen
              body={(_, rowData) => rowData?.rowIndex + 1}
            />
            <Column
              header="Enfermera/o"
              field="label"
              style={{ minWidth: '18rem', zIndex: 1 }}
              frozen
              className="p-0 m-0 text-center"
            />
            {diasDelMes.map((day) => (
              <Column
                key={JSON.stringify(day)}
                className="p-0 m-0 text-center"
                headerClassName="text-center"
                headerTooltip={format(day, "EEEE, d 'de' MMMM 'de' yyyy")}
                headerTooltipOptions={{
                  position: 'left',
                }}
                header={
                  <>
                    {day.getDate().toString()}
                    <br />
                    {getDayInitial(day)}
                  </>
                }
                body={(rowData) => (
                  <Dropdown
                    className="p-inputtext-sm outline-none border-noround dropdown__horario w-full"
                    options={jornadas}
                    dropdownIcon={null}
                    placeholder="NA"
                    value={jornadasIndex[filas[`${rowData.value}--${buildStringDate(day)}`]?.value]}
                    optionLabel="codigo"
                    onChange={onChangeValue(rowData, day)}
                    scrollHeight="6"
                    panelClassName="p-0 m-0 dropdown__horario flex flex-column align-items-center"
                    itemTemplate={(item) => (
                      <div
                        className="text-center py-2 font-bold  border-1"
                        style={{
                          width: '50px',
                          backgroundColor: item.color,
                          color: item?.colorLetra,
                        }}
                      >
                        <strong>{item.codigo}</strong>
                      </div>
                    )}
                    valueTemplate={(item) => (
                      <div
                        style={{
                          backgroundColor: item?.color,
                          color: item?.colorLetra,
                          height: '34.06px',
                        }}
                        className="w-full flex flex-column align-items-center justify-content-center font-bold"
                      >
                        <span>{item?.codigo || 'NA'}</span>
                      </div>
                    )}
                  />
                )}
              />
            ))}
          </DataTable>
        </div>
      </main>
    </PrivateLayout>
  );
};

export const getServerSideProps: GetServerSideProps<AsignacionHorarionsPageProps> = async ({ query }) => {
  const q = query?.q;
  if (!q) {
    const queryDate = String(new Date().toISOString().split('T')[0]);
    return {
      props: {
        q: queryDate,
      },
      redirect: {
        permanent: true,
        destination: `/horarios/asignacion?q=${queryDate}`,
      },
    };
  }
  return {
    props: {
      q: String(query?.q),
    },
  };
};

export default AsignacionHorarionsPage;
