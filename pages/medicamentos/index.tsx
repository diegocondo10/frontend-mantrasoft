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
import { MedicamentoService } from '@src/services/medicamento/medicamento.service';
import { PARAMETROS } from '@src/services/parametro/parametro.enum';
import { urlListarMedicamentos } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { CSSProperties } from 'react';

const MedicamentosPage: CustomNextPage = () => {
  const pagination = usePagination({
    uri: urlListarMedicamentos,
    key: 'ListadoMedicamentos',
    defaultFilters: {
      nombre: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      via: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
      variante: {
        value: '',
        matchMode: FilterMatchMode.CONTAINS,
      },
    },
  });

  const deleteMutation = useDeleteItem({
    mutationFn: (record) => new MedicamentoService().delete(record.id),
    onSuccess: () => {},
  });

  const { deleteRecordRef, deleteItemCommand } = useDeleteRecordConfirm();

  const queryParametros = useParametros({
    codigos: [PARAMETROS.MEDICACION_VIAS, PARAMETROS.MEDICACION_VARIANTES],
  });

  const cabecera = (
    <div className="flex flex-row justify-content-between">
      <Button className="ml-auto" href="/medicamentos/create/form" outlined icon={PrimeIcons.PLUS} label="Agregar" />
    </div>
  );

  return (
    <PrivateLayout
      title="Medicamentos"
      breadCrumbItems={[
        {
          label: 'Medicamentos',
        },
      ]}
    >
      <DeleteRecordConfirm
        ref={deleteRecordRef}
        onAccept={async (record) => {
          await deleteMutation.deleteRecord(record);
          await pagination.refetch();
        }}
        messageDetail={(record) => (
          <RecordDetail
            title="Estas seguro de eliminar este medicamento?"
            items={[
              ['Nombre', record.nombre],
              ['Via', record.via],
              ['Variante', record.variante],
            ]}
          />
        )}
      />
      <main className="flex flex-column">
        <PageTitle>Medicamentos</PageTitle>
        <PaginatedTable {...pagination.tableProps} header={cabecera} showIndexColumn>
          <Column header="Nombre" field="nombre" sortable filter showFilterMenu={false} />
          <Column
            header="Via"
            field="via"
            sortable
            filter
            showFilterMenu={false}
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                options={queryParametros?.data?.MEDICACION_VIAS}
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
          />
          <Column
            header="Variante"
            field="variante"
            sortable
            filter
            showFilterMenu={false}
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                options={queryParametros?.data?.MEDICACION_VARIANTES}
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
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
                    command: commandPush(`/medicamentos/editar/form?id=${rowData?.id}`),
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

MedicamentosPage.help = {
  title: 'Dashboard de Medicamentos',
  content:
    'Presenta información de los medicamentos ingresados conjunto con las acciones a realizar sobre los registros',
};

MedicamentosPage.isPrivate = true;

export default MedicamentosPage;
