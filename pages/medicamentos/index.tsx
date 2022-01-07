import Button from '@src/components/Button';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeleteMedicamento, urlListarMedicamentos } from '@src/services/urls';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

const MedicamentosPage: NextPage<any> = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch, filters, changeFilter, refetch } =
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
  const [eliminando, setEliminando] = useState(false);

  return (
    <PrivateLayout title="Medicamentos">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Medicamentos 
          <Button 
          href="/medicamentos/create/form" 
          variant="success" 
          sm 
          rounded 
          icon={PrimeIcons.PLUS} 
          tooltip='Agregar Registro'
          />
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
            <Column header="Nombre" field="nombre" sortable />
            <Column header="Descripción" field="descripcion" sortable />
            <Column header="Via" field="via" sortable />
            <Column header="Variante" field="variante" sortable/>
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
                    tooltip='Editar Registro'
                  />
                  <Button 
                    sm 
                    rounded 
                    icon={PrimeIcons.TRASH} variant="danger" 
                    onClick={async () => {
                    if (confirm(`Esta seguro eliminar la información de la persona ${rowData.nombre}?`)) {
                      try {
                        setEliminando(true);
                        await API.private().delete(urlDeleteMedicamento(rowData.id));
                        refetch();
                      } catch (error) {
                        alert('Se ha eliminado el registro exitosamente');
                      }
                      setEliminando(false);
                    }
                  }}
                    tooltip='Eliminar Registro'
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

MedicamentosPage.help = {
  title: 'Dashboard de Medicamentos',
  content: 'Presenta información de los medicamentos ingresados conjunto con las acciones a realizar sobre los registros',
};

export default MedicamentosPage;
