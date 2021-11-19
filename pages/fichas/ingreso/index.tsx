import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import {
  urlDeleteFichasIngreso,
  urlImprimirFichaIngreso,
  urlImprimirReporteEnfermeria,
  urlListadoFilterPacientes,
  urlListarFichasIngreso,
} from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { CSSProperties, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

const FichasIngresoPage: NextPage<any> = (props) => {
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
    <div className="d-flex flex-row">
      <span className="p-inputgroup w-full">
        <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
        <Dropdown
          placeholder="Seleccione un estado"
          name="estado"
          options={['ACTIVOS', 'INACTIVOS']}
          value={filters.estado}
          onChange={changeFilter}
        />
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
        <Dropdown
          placeholder="Seleccione la habitación"
          name="habitacion__id"
          showClear
          disabled={!filters?.habitacion__ala__id}
          options={habitaciones}
          value={filters.habitacion__id}
          onChange={changeFilter}
        />
      </span>
    </div>
  );

  return (
    <PrivateLayout
      title="Fichas de Ingreso"
      loading={{
        loading: isLoading || query.isLoading,
      }}
    >
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Fichas de Ingreso
          <Button href="/fichas/ingreso/create/form" variant="success" sm rounded icon={PrimeIcons.PLUS} />
        </h1>

        <div className="row row-cols-1">
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
              header="Opciones"
              bodyClassName="p-0 m-0"
              style={{ width: '100px' } as CSSProperties}
              body={(rowData) => (
                <ButtonMenu
                  block
                  label="Opciones"
                  icon={PrimeIcons.COG}
                  variant="info"
                  items={[
                    {
                      label: 'Editar',
                      icon: PrimeIcons.PENCIL,
                      command: (e) => {
                        router.push(`/fichas/ingreso/editar/form?id=${rowData?.id}`);
                      },
                    },
                    {
                      label: 'Dar de alta',
                      icon: PrimeIcons.ANGLE_DOUBLE_RIGHT,
                      command: async (e) => {
                        if (confirm('Esta en dar de alta a este paciente?')) {
                          // await API.private().delete(urlDeleteFichasIngreso(rowData.id));
                          await refetch();
                        }
                      },
                    },
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
                      label: 'Registro de pertenencias',
                      icon: PrimeIcons.LIST,
                      command: () => {
                        router.push(`/fichas/ingreso/pertenencias?id=${rowData.id}`);
                      },
                    },
                    {
                      label: 'Eliminar',
                      icon: PrimeIcons.TRASH,
                      command: async () => {
                        if (confirm('Esta seguro de eliminar esta ficha?')) {
                          await API.private().delete(urlDeleteFichasIngreso(rowData.id));
                          await refetch();
                        }
                      },
                    },
                  ]}
                />
              )}
            />
          </TablaPaginada>
        </div>
      </main>
    </PrivateLayout>
  );
};

export default FichasIngresoPage;
