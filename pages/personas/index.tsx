import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import DeleteRecordConfirm from '@src/components/DeleteRecordConfirm';
import RecordDetail from '@src/components/DeleteRecordConfirm/RecordDetail';
import useDeleteRecordConfirm from '@src/components/DeleteRecordConfirm/useDeleteRecordConfirm';
import PageTitle from '@src/components/PageTitle';
import MultiSelectFilter from '@src/components/Tables/filters/MultiSelectFilter';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import useDeleteItem from '@src/hooks/useDeleteItem';
import { useParametros } from '@src/hooks/useParametros';
import usePagination from '@src/hooks/v2/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { PARAMETROS } from '@src/services/parametro/parametro.enum';
import { PersonaService } from '@src/services/persona/persona.service';
import { urlListarPersonas } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { CSSProperties } from 'react';

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

  const deleteMutation = useDeleteItem({
    mutationFn: (persona) => new PersonaService().delete(persona.id),
  });

  const { deleteRecordRef, deleteItemCommand } = useDeleteRecordConfirm();

  const cabecera = () => (
    <div className="flex flex-wrap ">
      <Button className="ml-auto" icon={PrimeIcons.PLUS} href="/personas/create/form/" label="Agregar" outlined />
    </div>
  );

  return (
    <PrivateLayout
      title="Pacientes"
      loading={{
        loading: pagination.isLoading || queryParametros.isLoading || deleteMutation.isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Pacientes',
        },
      ]}
    >
      <DeleteRecordConfirm
        ref={deleteRecordRef}
        messageDetail={(paciente) => (
          <RecordDetail
            title="Estas seguro de eliminar el registro de este paciente?"
            items={[
              ['Tipo Identificación', paciente.tipoIdentificacion],
              ['Identificación', paciente.identificacion],
              ['Nombres', paciente.nombresApellidos],
              ['Celular', paciente.celular],
              ['Teléfono', paciente.telefono],
              ['Correo', paciente.correo],
            ]}
          />
        )}
        onAccept={async (paciente) => {
          await deleteMutation.deleteRecord(paciente);
          await pagination.refetch();
        }}
      />
      <main className="flex flex-column">
        <PageTitle>Pacientes</PageTitle>
        <PaginatedTable {...pagination.tableProps} header={cabecera}>
          <Column
            header="Tipo de identificación"
            field="tipoIdentificacion"
            sortable
            filter
            showFilterMenu={false}
            bodyStyle={{ minWidth: '15rem' }}
            filterField="tipo_identificacion"
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                options={queryParametros.data?.IDENTIFICACIONES}
                loading={queryParametros.isLoading || pagination.isQueryLoading}
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
            bodyStyle={{ minWidth: '15rem' }}
          />
          <Column
            header="Nombres"
            field="nombresApellidos"
            sortable
            sortField="nombres"
            filter
            showFilterMenu={false}
            filterField="nombres"
            bodyStyle={{ minWidth: '20rem' }}
          />
          <Column
            header="Celular"
            field="celular"
            sortable
            filter
            showFilterMenu={false}
            filterField="celular"
            filterType="number"
            bodyStyle={{ minWidth: '10rem' }}
          />
          <Column
            header="Telefono"
            field="telefono"
            sortable
            filter
            showFilterMenu={false}
            filterField="telefono"
            filterType="number"
            bodyStyle={{ minWidth: '10rem' }}
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
                  deleteItemCommand(rowData),
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

PersonasPage.isPrivate = true;

export default PersonasPage;
