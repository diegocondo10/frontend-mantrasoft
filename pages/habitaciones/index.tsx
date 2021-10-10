import Button from '@src/components/Button';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { urlListarHabitaciones } from '@src/services/urls';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import usePagination from 'usePagination';

const HabitacionesPage: NextPage<any> = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch } = usePagination({
    uri: urlListarHabitaciones,
    key: 'ListadoHabitaciones',
  });

  const cabecera = (
    <div className="d-flex flex-row">
      <span className="p-inputgroup w-full lg:w-5">
        <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
        {/* <Dropdown placeholder="Seleccione un ala" showClear /> */}
      </span>
    </div>
  );

  return (
    <PrivateLayout title="Habitaciones">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Habitaciones <Button href="/habitaciones/create" variant="success" sm rounded icon={PrimeIcons.PLUS} />
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
            <Column header="Ala" field="alaTitulo" sortField="ala__titulo" sortable />
            <Column header="No. habitación" field="numero" sortable />
            <Column header="Capacidad" field="capacidadPacientes" sortable />
            <Column header="Fecha de registro" field="createdAtStr" sortable sortField="createdAt" />
            <Column
              header="Opciones"
              body={(rowData) => (
                <div className="d-flex flex-row justify-content-around">
                  <Button sm rounded icon={PrimeIcons.PENCIL} variant="info" />
                  <Button sm rounded icon={PrimeIcons.INFO} variant="warning" />
                  <Button sm rounded icon={PrimeIcons.TRASH} variant="danger" />
                </div>
              )}
            />
          </TablaPaginada>
        </div>
      </main>
    </PrivateLayout>
  );
};

export default HabitacionesPage;
