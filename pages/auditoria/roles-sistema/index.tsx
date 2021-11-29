import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeleteRolesSistema, urlListarRolesSistema } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import React, { CSSProperties, useState } from 'react';

const RolesSistemaPage: NextPage<any> = () => {
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
    uri: urlListarRolesSistema,
    key: 'Roles-sistemas',
  });

  const [eliminando, setEliminando] = useState(false);

  return (
    <PrivateLayout title="Permisos">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Roles del sistema
          <Button
            outlined
            sm
            icon={PrimeIcons.PLUS}
            variant="success"
            rounded
            href="/auditoria/roles-sistema/create/form"
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
              loading={isLoading || eliminando}
            >
              {ColumnaNo()}
              <Column header="Nombre" field="nombre" sortable />
              <Column header="Código" field="codigo" sortable />
              <Column header="Descripción" field="descripcion" sortable />
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
                          router.push(`/auditoria/roles-sistema/editar/form?id=${rowData?.id}`);
                        },
                      },
                      {
                        label: 'Eliminar',
                        icon: PrimeIcons.TRASH,
                        command: async () => {
                          if (confirm(`Esta seguro eliminar la información del rol ${rowData.nombre}?`)) {
                            try {
                              setEliminando(true);
                              await API.private().delete(urlDeleteRolesSistema(rowData.id));
                              refetch();
                             } catch (error) {
                              alert('Se ha eliminado el registro exitosamente');
                            }
                            setEliminando(false);
                          }
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

export default RolesSistemaPage;
