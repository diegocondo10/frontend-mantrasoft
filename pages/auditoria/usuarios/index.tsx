import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeleteUsuarios, urlListarUsuarios, urlReiniciarPasswordUsuario } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { CSSProperties } from 'react';

const UsuarioPage: NextPage<any> = () => {
  const {
    isFetching,
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
    key: 'usuarios',
  });

  const tableHeader = () => {
    return (
      <div className="d-flex flex-row">
        <span className="p-inputgroup w-full">
          <Button
            outlined
            sm
            label="Agregar"
            icon={PrimeIcons.PLUS}
            variant="success"
            href="/auditoria/usuarios/create/form"
          />
        </span>
      </div>
    );
  };

  return (
    <PrivateLayout title="Usuarios">
      <main className="container-fluid">
        <h1 className="text-center my-5">Usuarios</h1>

        <div className="row">
          <div className="col-12">
            <TablaPaginada
              value={data?.data?.data || []}
              header={tableHeader}
              first={page}
              rows={data?.data?.pagina?.registrosPorPagina}
              totalRecords={data?.data?.pagina?.registrosTotales}
              onChangePage={setPage}
              onOrdering={setOrdering}
              multiSortMeta={ordering}
              loading={isFetching}
              className="border"
            >
              {ColumnaNo()}
              <Column header="Username" field="username" sortable />
              <Column header="Nombre completo" field="fullName" sortable />
              <Column header="Email" field="email" sortable />
              <Column
                header="Rol asignado"
                field="rol"
                // sortField="rol"
                // sortable
              />
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
                      {
                        label: 'Eliminar',
                        icon: PrimeIcons.TRASH,
                        command: async () => {
                          if (confirm('Esta seguro de eliminar este usuario')) {
                            await API.private().delete(urlDeleteUsuarios(rowData.id));
                            refetch();
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

UsuarioPage.help = {
  title: 'Dashboard de Usuarios',
  content: 'Contiene información de los usuarios del sistema conjunto con las acciones a realizar sobre los registros',
};

export default UsuarioPage;
