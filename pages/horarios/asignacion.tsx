import { urlEnfermeras, urlJornadas } from '@src/containers/horarios/urls';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { CustomNextPage } from '@src/types/next';
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

const AsignacionHorarionsPage: CustomNextPage<AsignacionHorarionsPageProps> = ({ q }) => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(q));

  const [enfermeras, setEnfermeras] = useState([]);
  const [jornadas, setJornadas] = useState([]);

  const [jornadasIndex, setJornadasIndex] = useState({});

  const [filas, setFilas] = useState({});

  const diasDelMes = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  }, [selectedDate]);

  const queryCatalogos = useQuery(
    ['catalogos-horarios-asignacion'],
    () => Promise.all([API.private().get(urlEnfermeras), API.private().get(urlJornadas)]),
    {
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
      refetchOnWindowFocus: false,
    },
  );

  const onSelectDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    router.replace({
      pathname: router.pathname,
      query: { q: formattedDate },
    });
    setSelectedDate(date);
  };

  const onChangeValue = (rowData: any, day: Date) => (event: DropdownChangeEvent) => {
    setFilas({
      ...filas,
      [`${rowData.value}-${day.toDateString()}`]: event.value,
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
          label: q,
        },
      ]}
    >
      <main className="grid grid-nogutter justify-content-center">
        <div className="col-11 md:col-5 border-1 border-gray-200 text-center my-4 p-5">
          <div className="flex flex-column">
            <label htmlFor="fecha">Seleccione:*</label>
            <DatePicker
              id="fecha"
              selected={selectedDate}
              onChange={onSelectDate}
              showMonthYearPicker
              locale="es"
              className="p-inputtext p-component font-semibold text-center"
              calendarClassName="p-input"
              dateFormat="MM/yyyy"
              renderMonthContent={(_, fullMonthText) => <p className="uppercase">{fullMonthText}</p>}
            />
          </div>
        </div>

        <div className="col-12 border-1 border-gray-200">
          <DataTable
            value={enfermeras}
            scrollable
            scrollHeight="400px"
            showGridlines
            frozenWidth="200px" // Ancho de las columnas congeladas
            className="p-datatable-frozen" // Clase adicional para aplicar estilos personalizados si es necesario
          >
            <Column
              header="No"
              className="p-0 m-0 text-center font-bold"
              style={{ zIndex: 99 }}
              frozen
              body={(_, rowData) => rowData?.rowIndex + 1}
            />
            <Column
              header="Enfermera/o"
              field="label"
              style={{ minWidth: '18rem', zIndex: 99 }}
              frozen
              className="p-0 m-0 text-center"
            />
            {diasDelMes.map((day, index) => (
              <Column
                key={JSON.stringify(day)}
                className="p-0 m-0"
                header={day.getDate().toString()}
                body={(rowData) => (
                  <div>
                    <Dropdown
                      className="p-inputtext-sm outline-none border-noround dropdown__horario w-full"
                      options={jornadas}
                      dropdownIcon={null}
                      value={filas[`${rowData.value}-${day.toDateString()}`]}
                      optionValue="id"
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
                  </div>
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
  return {
    props: {
      q: query?.q ? String(query?.q) : new Date().toISOString().split('T')[0],
    },
  };
};

export default AsignacionHorarionsPage;
