import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PageTitle from '@src/components/PageTitle';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import { urlRolesLabelValue } from '@src/containers/auth/urls';
import usePagination from '@src/hooks/v2/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlListarUsuarios } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { CSSProperties } from 'react';
import { useQuery } from 'react-query';

const UsuarioPage: CustomNextPage<any> = () => {
  // const { isFetching, data, page, setPage, setOrdering, ordering, refetch, search, setSearch } = usePagination({
  //   uri: urlListarUsuarios,
  //   key: 'usuarios',
  // });

  const queryCatalogos = useQuery(['catalogo-usuarios'], () => API.private().get(urlRolesLabelValue), {
    refetchOnWindowFocus: false,
  });

  const pagination = usePagination({
    key: ['usuarios'],
    uri: urlListarUsuarios,
    defaultFilters: {
      username: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      full_name: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      email: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      rol: {
        value: [],
        matchMode: FilterMatchMode.IN,
      },
    },
  });

  const tableHeader = () => {
    return (
      <div className="flex flex-wrap justify-content-end">
        <Button
          className="align-self-end"
          outlined
          label="Agregar"
          icon={PrimeIcons.PLUS}
          href="/auditoria/usuarios/create/form"
        />
      </div>
    );
  };

  return (
    <PrivateLayout
      title="Usuarios"
      breadCrumbItems={[
        {
          icon: PrimeIcons.USERS,
          label: 'Usuarios',
        },
      ]}
    >
      <main className="flex flex-column">
        <PageTitle>Usuarios</PageTitle>

        <PaginatedTable header={tableHeader} {...pagination?.tableProps}>
          {ColumnaNo()}
          <Column
            header="Identificación"
            field="username"
            sortable
            filter
            filterPlaceholder="Buscar"
            showFilterMenu={false}
            filterField="username"
          />
          <Column
            header="Nombre"
            field="fullName"
            sortable
            filter
            filterPlaceholder="Buscar"
            showFilterMenu={false}
            filterField="full_name"
            sortField="full_name"
          />
          <Column
            header="Email"
            field="email"
            sortable
            filter
            filterPlaceholder="Buscar"
            showFilterMenu={false}
            filterField="email"
          />
          <Column
            header="Rol"
            field="rol"
            filter
            filterPlaceholder="Buscar"
            showFilterMenu={false}
            filterField="rol"
            sortable
            filterElement={({ value, filterApplyCallback }) => {
              return (
                <MultiSelect
                  value={value}
                  filter
                  className="w-full"
                  placeholder="Seleccione"
                  maxSelectedLabels={0}
                  selectedItemsLabel="{} items"
                  options={queryCatalogos?.data?.data}
                  onChange={(e) => filterApplyCallback(e.value)}
                />
              );
            }}
          />
          <Column
            header="Acciones"
            bodyClassName="p-0 m-0 text-center"
            style={{ width: '100px' } as CSSProperties}
            body={(rowData) => (
              <ButtonMenu
                items={[
                  {
                    label: 'Editar',
                    icon: PrimeIcons.PENCIL,
                    command: commandPush(`/auditoria/usuarios/editar/form?id=${rowData?.id}`),
                  },
                ]}
              />
            )}
          />
        </PaginatedTable>
      </main>
    </PrivateLayout>
  );
};

UsuarioPage.getInitialProps = ({ query }) => query;

UsuarioPage.help = {
  title: 'Dashboard de Usuarios',
  content: 'Contiene información de los usuarios del sistema conjunto con las acciones a realizar sobre los registros',
};

export default UsuarioPage;
