import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PageTitle from '@src/components/PageTitle';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeletePersona, urlListarPersonas } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { CSSProperties, useState } from 'react';

const PersonasPage: CustomNextPage = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch, refetch } = usePagination({
    uri: urlListarPersonas,
    key: 'ListadoPersonas',
  });

  const [eliminando, setEliminando] = useState(false);

  const cabecera = () => (
    <div className="flex flex-wrap lg:justify-content-between">
      <span className="p-inputgroup w-full lg:w-6">
        <InputText
          className="border-1 border-primary"
          type="search"
          placeholder="Buscar"
          value={search}
          onChange={setSearch}
        />
      </span>
      <Button icon={PrimeIcons.PLUS} href="/personas/create/form/" label="Agregar" outlined />
    </div>
  );

  return (
    <PrivateLayout
      loading={{
        loading: isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Pacientes',
        },
      ]}
    >
      <main className="flex flex-column">
        <PageTitle>Pacientes</PageTitle>
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
          <Column header="Tipo de identificación" field="tipoIdentificacion" sortable />
          <Column header="Identificación" field="identificacion" sortable />
          <Column header="Nombres" field="nombresApellidos" sortable sortField="primerApellido" />
          <Column header="Celular" field="celular" sortable />
          <Column header="Telefono" field="telefono" sortable />
          <Column header="Correo" field="correo" sortable />
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
                          refetch();
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
        </TablaPaginada>
      </main>
    </PrivateLayout>
  );
};

PersonasPage.help = {
  title: 'Dashboard de Personas',
  content: 'Contiene información de las personas registradas dentro del sistema',
};

export default PersonasPage;
