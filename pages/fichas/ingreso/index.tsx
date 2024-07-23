import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PageTitle from '@src/components/PageTitle';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import {
  urlImprimirFichaIngreso,
  urlImprimirReporteEnfermeria,
  urlListadoFilterPacientes,
  urlListarFichasIngreso,
} from '@src/services/urls';
import { commandPush } from '@src/utils/router';
import moment from 'moment';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

const FichasIngresoPage: NextPage<any> = () => {
  const {
    isLoading,
    data,
    page,
    setPage,
    setOrdering,
    ordering,
    search,
    setSearch,
    filters,
    changeFilter,
    setFilters,
    refetch,
  } = usePagination({
    uri: urlListarFichasIngreso,
    key: 'ListadoFichasIngreso',
  });

  const [showModal, setShowModal] = useState(false);
  const [fecha, setFecha] = useState(moment().format('YYYY-MM-DD'));
  const [id, setId] = useState(null);
  const query = useQuery(['alasHabitaciones'], () => API.private().get<any[]>(urlListadoFilterPacientes), {
    refetchOnWindowFocus: false,
  });

  const habitaciones = useMemo(
    () => query?.data?.data?.find?.((ala) => ala.value === filters?.habitacion__ala__id)?.habitaciones || [],
    [filters?.habitacion__ala__id, query?.data?.data],
  );

  useEffect(() => {
    setFilters({
      estado: 'ACTIVOS',
    });
  }, []);

  const cabecera = (
    <div className="flex flex-wrap lg:justify-content-between">
      <span className="flex flex-column lg:w-6">
        <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
        <div className="flex flex-wrap justify-content-between">
          <div>
            <label htmlFor="">Estado:</label>
            <Dropdown
              placeholder="Seleccione un estado"
              name="estado"
              options={['ACTIVOS', 'INACTIVOS']}
              value={filters.estado}
              onChange={changeFilter}
            />
          </div>
          <div>
            <label htmlFor="">Estado:</label>
            <Dropdown
              placeholder="Seleccione el ala"
              name="habitacion__ala__id"
              showClear
              options={query?.data?.data || []}
              value={filters?.habitacion__ala__id}
              onChange={(e) => {
                if (!e.target.value) {
                  filters.habitacion__id = null;
                }
                setFilters({
                  ...filters,
                  habitacion__ala__id: e.target.value,
                });
              }}
            />
          </div>

          <Dropdown
            placeholder="Seleccione la habitación"
            name="habitacion__id"
            showClear
            disabled={!filters?.habitacion__ala__id}
            options={habitaciones}
            value={filters.habitacion__id}
            onChange={changeFilter}
          />
        </div>
      </span>
      <Button href="/fichas/ingreso/create/form" outlined icon={PrimeIcons.PLUS} label="Agregar" />
    </div>
  );

  return (
    <PrivateLayout
      title="Fichas de Ingreso"
      loading={{
        loading: isLoading || query.isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Fichas de Ingreso',
        },
      ]}
    >
      <main className="flex flex-column">
        <PageTitle>Fichas de ingreso</PageTitle>

        <TablaPaginada
          value={data?.data?.data || []}
          header={cabecera}
          first={page}
          rows={data?.data?.pagina?.registrosPorPagina}
          totalRecords={data?.data?.pagina?.registrosTotales}
          onChangePage={setPage}
          onOrdering={setOrdering}
          multiSortMeta={ordering}
          loading={isLoading}
        >
          {ColumnaNo()}
          <Column header="Código" field="id" sortable />
          <Column header="Paciente" field="pacienteView.str" sortable />
          <Column header="Ala" field="habitacionView.ala.str" sortable />
          <Column header="Habitación" field="habitacionView.numero" sortable />
          <Column
            header="Acciones"
            bodyClassName="p-0 m-0 text-center"
            style={{ width: '100px' } as CSSProperties}
            body={(rowData) => (
              <ButtonMenu
                items={[
                  {
                    label: 'Tratamientos',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/tratamientos?id=${rowData.id}&pacienteId=${rowData.pacienteView?.id}`),
                  },
                  {
                    label: 'Editar',
                    icon: PrimeIcons.PENCIL,
                    command: commandPush(`/fichas/ingreso/editar/form?id=${rowData?.id}`),
                  },
                  {
                    separator: true,
                  },
                  {
                    label: 'Reportes',
                    icon: PrimeIcons.PRINT,
                    items: [
                      {
                        label: 'Imprimir ficha de ingreso',
                        icon: PrimeIcons.PRINT,
                        command: API.getReporte(urlImprimirFichaIngreso(rowData.id)),
                      },
                      {
                        label: 'Imprimir Reporte de enfermeria',
                        icon: PrimeIcons.PRINT,
                        command: API.getReporte(urlImprimirReporteEnfermeria(rowData.id)),
                      },
                      {
                        label: 'Control de medicación',
                        icon: PrimeIcons.PRINT,
                        command: () => {
                          setShowModal(true);
                          setId(rowData.id);
                        },
                      },
                    ],
                  },

                  {
                    label: 'Bitacora de enfermeria',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/fichas/ingreso/seguimientos?id=${rowData.id}`),
                  },
                  {
                    label: 'Signo vitales',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/fichas/ingreso/signos-vitales?id=${rowData.id}`),
                  },
                  {
                    label: 'Registro de pertenencias',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/fichas/ingreso/pertenencias?id=${rowData.id}`),
                  },
                ]}
              />
            )}
          />
        </TablaPaginada>

        {/* <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          modal={{ size: 'sm', centered: true }}
          header={{ title: 'Control de medicación', closeButton: true }}
        >
          <div className="d-flex">
            <input
              value={fecha}
              onChange={(evt) => {
                setFecha(evt.target.value);
              }}
              className="form-control"
              type="date"
              required
              name="fecha"
            />
            <Button
              type="submit"
              className="rounded-0"
              label="Imprimir"
              sm
              icon={PrimeIcons.PRINT}
              onClick={API.getReporte(
                urlImprimirControlMedicacion(id, +fecha?.split?.('-')?.[1], fecha?.split?.('-')?.[0]),
              )}
            />
          </div>
        </Modal> */}
      </main>
    </PrivateLayout>
  );
};

export default FichasIngresoPage;
