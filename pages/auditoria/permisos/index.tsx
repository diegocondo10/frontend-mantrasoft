import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { urlListarPermisos } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import React, { CSSProperties } from 'react';

const Permisos: NextPage<any> = (props) => {
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
    uri: urlListarPermisos,
    key: 'ListadoPermisos',
  });

  return (
    <PrivateLayout title="Permisos">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Listado de permisos
          <Button
            outlined
            sm
            icon={PrimeIcons.PLUS}
            variant="success"
            rounded
            href="/auditoria/permisos/create/form"
            tooltip="Agregar Registro"
          />
        </h1>

        <div className="row">
          <div className="col-12">
            <TablaPaginada
              value={data?.data?.data || []}
              //   header={cabecera}
              first={page}
              rows={data?.data?.pagina?.registrosPorPagina}
              totalRecords={data?.data?.pagina?.registrosTotales}
              onChangePage={setPage}
              onOrdering={setOrdering}
              multiSortMeta={ordering}
              loading={isLoading}
            >
              {ColumnaNo()}
              <Column header="Código" field="codigo" sortable />
              <Column header="Descripción" field="descripcion" sortable />
              <Column
                header="Opciones"
                bodyClassName="p-0 m-0"
                style={{ width: '100px' } as CSSProperties}
                body={(rowData) => (
                  <ButtonMenu
                    label="Opciones"
                    icon={PrimeIcons.COG}
                    variant="info"
                    items={[
                      {
                        label: 'Editar',
                        icon: PrimeIcons.PENCIL,
                        command: (e) => {
                          router.push(`/auditoria/permisos/editar/form?id=${rowData?.id}`);
                        },
                      },
                    ]}
                  />
                )}
              />
            </TablaPaginada>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};

Permisos.help = {
  title: 'Dashboard de permisos',
  content: 'Presenta información de los roles ingresados conjunto con las acciones a realizar sobre los registros',
};

export default Permisos;
