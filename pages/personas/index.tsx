import Button from '@src/components/Button';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { urlListarPersonas } from '@src/services/urls';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import usePagination from 'usePagination';

const PersonasPage: NextPage<any> = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch } = usePagination({
    uri: urlListarPersonas,
    key: 'ListadoPersonas',
  });

  const cabecera = (
    <div>
      <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
    </div>
  );

  return (
    <PrivateLayout>
      <main className="container-fluid">
        <h1 className="text-center mt-3">
          Listado de personas <Button icon={PrimeIcons.PLUS} variant="success" sm rounded href="/personas/create/" />
        </h1>

        <div className=" row row-cols-1">
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
            <Column header="Tipo de identificación" field="tipoIdentificacion" sortable />
            <Column header="Identificación" field="identificacion" sortable />
            <Column header="Nombres y Apellidos" field="nombresApellidos" sortable sortField="primerApellido" />
            <Column header="Celular" field="celular" sortable />
            <Column header="Telefono" field="telefono" sortable />
            <Column header="Correo" field="correo" sortable />
            <Column
              body={(rowData) => (
                <div className="d-flex flex-row justify-content-around">
                  <Button sm rounded icon={PrimeIcons.PENCIL} />
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

export default PersonasPage;
