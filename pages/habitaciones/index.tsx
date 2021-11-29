import Button from '@src/components/Button';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeleteHabitacion, urlListarHabitaciones } from '@src/services/urls';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

const HabitacionesPage: NextPage<any> = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch, refetch } = usePagination({
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

  const [eliminando, setEliminando] = useState(false);

  return (
    <PrivateLayout title="Habitaciones">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Habitaciones <Button href="/habitaciones/create/form" variant="success" sm rounded icon={PrimeIcons.PLUS} />
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
            loading={isLoading || eliminando}
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
                  <Button
                    sm
                    rounded
                    icon={PrimeIcons.PENCIL}
                    variant="info"
                    href={`/habitaciones/editar/form?id=${rowData?.id}`}
                  />
                  <Button
                    sm
                    rounded
                    icon={PrimeIcons.INFO}
                    variant="warning"
                    href={`/habitaciones/detalle?id=${rowData?.id}`}
                  />
                  <Button sm rounded icon={PrimeIcons.TRASH} variant="danger"
                 onClick={async () => {
                    if (confirm(`Esta seguro eliminar la información de la habitación ${rowData.alaNumeroHabitacion}?`)) {
                      try {
                        setEliminando(true);
                        await API.private().delete(urlDeleteHabitacion(rowData.id));
                        refetch();
                       } catch (error) {
                        alert('Se ha eliminado el registro exitosamente');
                      }
                      setEliminando(false);
                    }
                  }}
                  />
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
