import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeleteHabitacion, urlListarHabitaciones } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { CSSProperties, useState } from 'react';

const HabitacionesPage: CustomNextPage = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch, refetch } = usePagination({
    uri: urlListarHabitaciones,
    key: 'ListadoHabitaciones',
  });

  const cabecera = (
    <div className="flex flex-wrap justify-content-between">
      <InputText className="w-20rem border-1 border-primary" type="search" placeholder="Buscar" value={search} onChange={setSearch} />
      <Button icon={PrimeIcons.PLUS} href="/habitaciones/create/form/" label="Agregar" outlined />
    </div>
  );

  const [eliminando, setEliminando] = useState(false);

  return (
    <PrivateLayout
      title="Habitaciones"
      breadCrumbItems={[
        {
          label: 'Habitaciones',
        },
      ]}
    >
      <main className="flex flex-column">
        <p className="text-center my-5 text-5xl text-gray-600">Habitaciones</p>

        <TablaPaginada
          value={data?.data?.data || []}
          header={cabecera}
          first={page}
          rows={data?.data?.pagina?.registrosPorPagina}
          totalRecords={data?.data?.pagina?.registrosTotales}
          onChangePage={setPage}
          onOrdering={setOrdering}
          multiSortMeta={ordering}
          loading={isLoading || eliminando}
        >
          {ColumnaNo()}

          <Column header="No. habitación" field="numero" sortable />
          <Column header="Capacidad" field="capacidadPacientes" sortable />
          <Column header="Ala" field="alaTitulo" />
          <Column header="Fecha de registro" field="createdAtStr" sortable sortField="createdAt" />
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
                ]}
              />
            )}
          />
        </TablaPaginada>
      </main>
    </PrivateLayout>
  );
};

HabitacionesPage.help = {
  title: 'Dashboard de habitaciones',
  content:
    'Contiene información de las habitaciones registradas con las acciones que se pueden realizar en los registros',
};
export default HabitacionesPage;
