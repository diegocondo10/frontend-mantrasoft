import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PageTitle from '@src/components/PageTitle';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import { urlRolesLabelValue } from '@src/containers/auth/urls';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlListarUsuarios } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { default as router } from 'next/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, DataTableFilterMetaData } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';
import { CSSProperties, useCallback, useState } from 'react';
import { useQuery } from 'react-query';

const UsuarioPage: CustomNextPage<any> = () => {
  // const { isFetching, data, page, setPage, setOrdering, ordering, refetch, search, setSearch } = usePagination({
  //   uri: urlListarUsuarios,
  //   key: 'usuarios',
  // });

  const queryCatalogos = useQuery(['catalogo-usuarios'], () => API.private().get(urlRolesLabelValue), {
    refetchOnWindowFocus: false,
  });
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
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
  });

  const buildUrl = useCallback(
    ({ url, page: number, filters = {} }) => {
      const queryObject = {};
      const queryString = new URLSearchParams();
      if (page && page > 0) {
        queryObject['page'] = page + 1;
        queryString.append('page', String(page + 1));
      }

      const entries = Object.entries(filters);
      entries.forEach(([key, value]: [string, DataTableFilterMetaData]) => {
        if (Array.isArray(value.value)) {
          value.value.forEach((item) => {
            queryString.append(key, item);
          });
          return;
        }

        if (typeof value.value === 'string' && value.value.trim() !== '') {
          queryString.append(key, value.value);
        }
      });
      const queryParams = queryString.toString();
      return url + (queryParams ? `?${queryParams}` : '');
    },
    [page, filters],
  );

  const query = useQuery({
    queryKey: ['usuarios', urlListarUsuarios, page, filters],
    queryFn: ({ signal }) => {
      const url = buildUrl({
        url: urlListarUsuarios,
        page,
        filters,
      });
      return API.private().get<any>(url, { signal });
    },
    keepPreviousData: true,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    isDataEqual: () => false,
    onSuccess: ({ data }) => {
      // console.log('DATA: ', data);
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

        <DataTable
          rowHover
          paginator
          stripedRows
          showGridlines
          lazy
          header={tableHeader}
          loading={query.isLoading}
          value={query?.data?.data?.data}
          first={page}
          rows={query.data?.data?.pagina?.registrosPorPagina}
          totalRecords={query.data?.data?.pagina?.registrosTotales}
          onPage={(event) => {
            setPage(event.page);
          }}
          filterDisplay="row"
          onFilter={(event) => {
            setFilters(event.filters);
          }}
          filters={filters}
        >
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
                    command: (e) => {
                      router.push(`/auditoria/usuarios/editar/form?id=${rowData?.id}`);
                    },
                  },
                ]}
              />
            )}
          />
        </DataTable>

        {/* <TablaPaginada
          value={data?.data?.data || []}
          header={tableHeader}
          first={page}
          rows={data?.data?.pagina?.registrosPorPagina}
          totalRecords={data?.data?.pagina?.registrosTotales}
          onChangePage={setPage}
          onOrdering={setOrdering}
          multiSortMeta={ordering}
          loading={isFetching}
          filterDisplay="row"
          onFilter={(event) => {}}
          filters={{
            username: {
              value: '',
              matchMode: FilterMatchMode.CONTAINS,
            },
            fullName: {
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
          }}
        >
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
            filterElement={({ value, filterApplyCallback }) => {
              return (
                <MultiSelect
                  value={value}
                  filter
                  className="w-full"
                  placeholder="Seleccione"
                  maxSelectedLabels={0}
                  selectedItemsLabel="{} selecciones"
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
                    command: (e) => {
                      router.push(`/auditoria/usuarios/editar/form?id=${rowData?.id}`);
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
        </TablaPaginada> */}
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
