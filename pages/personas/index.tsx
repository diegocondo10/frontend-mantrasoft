import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PageTitle from '@src/components/PageTitle';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import { useParametros } from '@src/hooks/useParametros';
import usePagination from '@src/hooks/v2/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { PARAMETROS } from '@src/services/parametro/parametro.enum';
import { urlDeletePersona, urlListarPersonas } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { CSSProperties, useState } from 'react';

const PersonasPage: CustomNextPage = () => {
  const queryParametros = useParametros({
    codigos: [PARAMETROS.IDENTIFICACIONES],
  });

  const pagination = usePagination({
    key: urlListarPersonas,
    uri: urlListarPersonas,
    defaultFilters: {
      tipo_identificacion: {
        value: [],
        matchMode: FilterMatchMode.IN,
      },
      identificacion: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      nombres: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      celular: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      telefono: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      correo: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
    },
  });

  const [eliminando, setEliminando] = useState(false);

  const cabecera = () => (
    <div className="flex flex-wrap ">
      <Button className="ml-auto" icon={PrimeIcons.PLUS} href="/personas/create/form/" label="Agregar" outlined />
    </div>
  );

  return (
    <PrivateLayout
      loading={{
        loading: pagination.isLoading || queryParametros.isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Pacientes',
        },
      ]}
    >
      <main className="flex flex-column">
        <PageTitle>Pacientes</PageTitle>
        <PaginatedTable {...pagination.tableProps} header={cabecera}>
          {ColumnaNo()}
          <Column
            header="Tipo de identificación"
            field="tipoIdentificacion"
            sortable
            filter
            showFilterMenu={false}
            filterField="tipo_identificacion"
            filterElement={(filter) => (
              <MultiSelect
                value={filter.value}
                options={queryParametros.data?.IDENTIFICACIONES}
                loading={queryParametros.isLoading}
                maxSelectedLabels={0}
                selectedItemsLabel="{} items"
                placeholder="Seleccione"
                onChange={(e) => filter.filterApplyCallback(e.value)}
              />
            )}
          />
          <Column
            header="Identificación"
            field="identificacion"
            sortable
            filter
            showFilterMenu={false}
            filterField="identificacion"
            filterType="select"
          />
          <Column
            header="Nombres"
            field="nombresApellidos"
            sortable
            sortField="nombres"
            filter
            showFilterMenu={false}
            filterField="nombres"
          />
          <Column
            header="Celular"
            field="celular"
            sortable
            filter
            showFilterMenu={false}
            filterField="celular"
            filterType="number"
          />
          <Column
            header="Telefono"
            field="telefono"
            sortable
            filter
            showFilterMenu={false}
            filterField="telefono"
            filterType="number"
          />
          <Column
            header="Correo"
            field="correo"
            sortable
            filter
            showFilterMenu={false}
            filterField="correo"
            filterType="email"
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
                    command: commandPush(`/personas/editar/form?id=${rowData?.id}`),
                  },
                  {
                    label: 'Detalle',
                    icon: PrimeIcons.FILE,
                    command: commandPush(`/personas/detalle?id=${rowData.id}`),
                  },
                  {
                    label: 'Eliminar',
                    icon: PrimeIcons.TRASH,
                    command: async () => {
                      if (confirm(`Esta seguro eliminar la información de la persona ${rowData.nombresApellidos}?`)) {
                        try {
                          setEliminando(true);
                          await API.private().delete(urlDeletePersona(rowData.id));
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
        </PaginatedTable>
      </main>
    </PrivateLayout>
  );
};

PersonasPage.help = {
  title: 'Dashboard de Personas',
  content: 'Contiene información de las personas registradas dentro del sistema',
};

export default PersonasPage;
