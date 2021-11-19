import Button from '@src/components/Button';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { urlListarMedicamentos } from '@src/services/urls';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React from 'react';

const MedicamentosPage: NextPage<any> = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch, filters, changeFilter } =
    usePagination({
      uri: urlListarMedicamentos,
      key: 'ListadoMedicamentos',
    });

  const cabecera = (
    <div className="d-flex flex-row">
      <span className="p-inputgroup w-full lg:w-5">
        <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
        <Dropdown
          placeholder="Seleccione"
          name="via"
          showClear
          options={['VO', 'VA']}
          value={filters.via}
          onChange={changeFilter}
        />
      </span>
    </div>
  );

  return (
    <PrivateLayout title="Medicamentos">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Medicamentos <Button href="/medicamentos/create/form" variant="success" sm rounded icon={PrimeIcons.PLUS} />
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
            <Column header="Nombre" field="nombre" sortable />
            <Column header="Descripción" field="descripcion" sortable />
            <Column header="Via" field="via" sortable />
            <Column
              header="Opciones"
              body={(rowData) => (
                <div className="d-flex flex-row justify-content-around">
                  <Button
                    sm
                    rounded
                    icon={PrimeIcons.PENCIL}
                    variant="info"
                    href={`/medicamentos/editar/form?id=${rowData?.id}`}
                  />
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

export default MedicamentosPage;
