import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDeleteMedicamento, urlListarMedicamentos } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { CSSProperties, useState } from 'react';

const MedicamentosPage: CustomNextPage = () => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch, filters, changeFilter, refetch } =
    usePagination({
      uri: urlListarMedicamentos,
      key: 'ListadoMedicamentos',
    });

  const cabecera = (
    <div className="flex flex-row justify-content-between">
      <span className="p-inputgroup lg:w-6">
        <InputText
          className="border-1 border-primary"
          type="search"
          placeholder="Buscar"
          value={search}
          onChange={setSearch}
        />
        {/* <Dropdown
          placeholder="Seleccione"
          name="via"
          showClear
          options={['VO', 'VR', 'VI']}
          value={filters.via}
          onChange={changeFilter}
          tooltip="VIA"
        /> */}
      </span>
      <Button href="/medicamentos/create/form" variant="success" outlined icon={PrimeIcons.PLUS} label="Agregar" />
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
        <p className="text-center text-5xl text-gray-600">Medicamentos</p>
        <div className="row row-cols-1">
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
            <Column header="Nombre" field="nombre" sortable />
            {/* <Column header="Descripción" field="descripcion" /> */}
            <Column header="Via" field="via" sortable />
            <Column header="Variante" field="variante" sortable />
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
        </div>
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
