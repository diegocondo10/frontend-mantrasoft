import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PageTitle from '@src/components/PageTitle';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import usePagination from '@src/hooks/v2/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeleteMedicamento, urlListarMedicamentos } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { CSSProperties, useState } from 'react';

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

  const cabecera = (
    <div className="flex flex-row justify-content-between">
      <Button className="ml-auto" href="/medicamentos/create/form" outlined icon={PrimeIcons.PLUS} label="Agregar" />
    </div>
  );
  const [eliminando, setEliminando] = useState(false);

  return (
    <PrivateLayout
      title="Medicamentos"
      breadCrumbItems={[
        {
          label: 'Medicamentos',
        },
      ]}
    >
      <main className="flex flex-column">
        <PageTitle>Medicamentos</PageTitle>
        <PaginatedTable {...pagination.tableProps} header={cabecera} showIndexColumn>
          <Column header="Nombre" field="nombre" sortable filter showFilterMenu={false} />
          <Column header="Via" field="via" sortable filter showFilterMenu={false} />
          <Column header="Variante" field="variante" sortable filter showFilterMenu={false} />
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
                  {
                    label: 'Eliminar',
                    icon: PrimeIcons.TRASH,
                    command: async () => {
                      if (confirm(`Esta seguro eliminar la información de la persona ${rowData.nombre}?`)) {
                        try {
                          setEliminando(true);
                          await API.private().delete(urlDeleteMedicamento(rowData.id));
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

MedicamentosPage.help = {
  title: 'Dashboard de Medicamentos',
  content:
    'Presenta información de los medicamentos ingresados conjunto con las acciones a realizar sobre los registros',
};

export default MedicamentosPage;
