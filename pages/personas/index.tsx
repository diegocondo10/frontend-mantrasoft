import Button from '@src/components/Button';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeletePersona, urlListarPersonas } from '@src/services/urls';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

const PersonasPage: NextPage<any> = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch, refetch } = usePagination({
    uri: urlListarPersonas,
    key: 'ListadoPersonas',
  });

  const [eliminando, setEliminando] = useState(false);

  const cabecera = (
    <div>
      <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
    </div>
  );

  return (
    <PrivateLayout>
      <main className="container-fluid">
        <h1 className="text-center mt-3">
          Listado de personas{' '}
          <Button 
          icon={PrimeIcons.PLUS} variant="success" sm rounded href="/personas/create/form/"
          tooltip='Agregar registro'
          />
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
            loading={isLoading || eliminando}
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
                  <Button 
                    sm 
                    rounded 
                    icon={PrimeIcons.PENCIL} href={`/personas/editar/form?id=${rowData?.id}`} 
                    tooltip='Editar Registro'
                  />
                  <Button
                    sm
                    rounded
                    icon={PrimeIcons.INFO}
                    variant="warning"
                    href={`/personas/detalle?id=${rowData.id}`}
                    tooltip='Mirar información de registro'
                  />
                  <Button
                    sm
                    rounded
                    icon={PrimeIcons.TRASH}
                    variant="danger"
                    onClick={async () => {
                      if (confirm(`Esta seguro eliminar la información de la persona ${rowData.nombresApellidos}?`)) {
                        try {
                          setEliminando(true);
                          await API.private().delete(urlDeletePersona(rowData.id));
                          refetch();
                        } catch (error) {
                          alert('Se ha eliminado el registro exitosamente');
                        }
                        setEliminando(false);
                      }
                    }}
                    tooltip='Eliminar registro'
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

export default PersonasPage;
