import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlListarUsuarios, urlReiniciarPasswordUsuario } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import React, { CSSProperties } from 'react';

const UsuarioPage: NextPage<any> = () => {
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
    uri: urlListarUsuarios,
    key: 'Usuarios',
  });

  return (
    <PrivateLayout title="Usuarios">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Usuarios del sistema
          <Button 
            outlined 
            sm 
            icon={PrimeIcons.PLUS} 
            variant="success" 
            rounded 
            href="/auditoria/usuarios/create/form" 
            tooltip='Agregar Registro'
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
              <Column header="Username" field="username" sortable />
              <Column header="Nombre completo" field="fullName" sortable />
              <Column header="Email" field="email" sortable />
              <Column header="Es super usuario?" field="isSuperuserStr" sortField="isSuperuser" sortable />
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
                          router.push(`/auditoria/usuarios/editar/form?id=${rowData?.id}`);
                        },
                      },
                      {
                        label: 'Reiniciar contraseña',
                        icon: PrimeIcons.LOCK_OPEN,
                        command: async () => {
                          try {
                            await API.private().get(urlReiniciarPasswordUsuario(rowData.id));
                            alert(`Se ha enviado un correo al usuario ${rowData.fullName} con su nueva contraseña`);
                          } catch (error) {
                            alert(
                              `Ha ocurrido un problema al intentar reiniciar la contraseña del usuario ${
                                rowData?.fullName || rowData?.username
                              }`,
                            );
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

export default UsuarioPage;
