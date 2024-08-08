import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import DeleteRecordConfirm, { DeleteRecordConfirmHandle } from '@src/components/DeleteRecordConfirm';
import RecordDetail from '@src/components/DeleteRecordConfirm/RecordDetail';
import PageTitle from '@src/components/PageTitle';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import useDeleteItem from '@src/hooks/useDeleteItem';
import usePagination from '@src/hooks/v2/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { HabitacionService } from '@src/services/habitacion/habitacion.service';
import { urlListarHabitaciones } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { CSSProperties, useRef } from 'react';

const HabitacionesPage: CustomNextPage = () => {
  const pagination = usePagination({
    uri: urlListarHabitaciones,
    key: 'ListadoHabitaciones',
    defaultFilters: {
      numero: {
        value: '',
        matchMode: FilterMatchMode.EQUALS,
      },
      capacidad_pacientes: {
        value: '',
        matchMode: FilterMatchMode.EQUALS,
      },
      ala: {
        value: [],
        matchMode: FilterMatchMode.EQUALS,
      },
    },
  });

  const deleteMutation = useDeleteItem({
    mutationFn: (item) => new HabitacionService().delete(item.id),
  });
  const deleteRecordConfirmRef = useRef<DeleteRecordConfirmHandle>(null);

  return (
    <PrivateLayout
      title="Habitaciones"
      breadCrumbItems={[
        {
          label: 'Habitaciones',
        },
      ]}
    >
      <DeleteRecordConfirm
        ref={deleteRecordConfirmRef}
        messageDetail={(item) => (
          <RecordDetail
            title="Estas seguro de eliminar esta habitación?"
            items={[
              ['Ala', item.ala],
              ['Nro.', item.numero],
              ['Capacidad', item.capacidadPacientes],
            ]}
          />
        )}
        onAccept={async (item) => {
          await deleteMutation.deleteRecord(item);
          await pagination.refetch();
        }}
      />
      <main className="flex flex-column">
        <PageTitle>Habitaciones</PageTitle>
        <PaginatedTable
          {...pagination.tableProps}
          showIndexColumn
          header={
            <div className="flex flex-wrap">
              <Button
                className="ml-auto"
                icon={PrimeIcons.PLUS}
                href="/habitaciones/create/form/"
                label="Agregar"
                outlined
              />
            </div>
          }
        >
          <Column
            header="No. habitación"
            field="numero"
            sortable
            filter
            filterPlaceholder="Buscar"
            showFilterMenu={false}
          />
          <Column
            header="Capacidad"
            field="capacidadPacientes"
            sortable
            filter
            filterField="capacidad_pacientes"
            filterPlaceholder="Buscar"
            showFilterMenu={false}
          />
          <Column header="Ala" field="ala" sortable filter filterPlaceholder="Buscar" showFilterMenu={false} />
          <Column header="Fecha de registro" field="createdAt" sortable sortField="createdAt" />
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
                    command: commandPush(`/habitaciones/editar/form?id=${rowData?.id}`),
                  },
                  {
                    label: 'Eliminar',
                    icon: PrimeIcons.TRASH,
                    command: deleteRecordConfirmRef.current?.deleteRecord(rowData),
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

HabitacionesPage.help = {
  title: 'Dashboard de habitaciones',
  content:
    'Contiene información de las habitaciones registradas con las acciones que se pueden realizar en los registros',
};

HabitacionesPage.isPrivate = true;

export default HabitacionesPage;
