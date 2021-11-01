import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { urlListarPersonal } from '@src/services/urls';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React, { CSSProperties } from 'react';

const PersonalPage: NextPage<any> = (props) => {
  const { isLoading, data, page, setPage, setOrdering, ordering, search, setSearch } = usePagination({
    uri: urlListarPersonal,
    key: 'ListadoPersonas',
  });

  const cabecera = (
    <div>
      <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
    </div>
  );

  return (
    <PrivateLayout title="Personal">
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Listado del personal{' '}
          <Button icon={PrimeIcons.PLUS} variant="success" sm rounded href="/personal/create/form" />
        </h1>
        <div className="row">
          <div className="col-12">
            <TablaPaginada
              value={data?.data?.data || []}
              header={cabecera}
              first={page}
              rows={data?.data?.pagina?.registrosPorPagina}
              totalRecords={data?.data?.pagina?.registrosTotales}
              onChangePage={setPage}
              onOrdering={setOrdering}
              multiSortMeta={ordering}
              loading={isLoading}
            >
              {ColumnaNo()}
              <Column header="Información" field="personaStr" sortable />
              <Column header="Rol asignado" field="rolStr" sortable />
              <Column
                header="Opciones"
                bodyClassName="p-0 m-0"
                style={{ width: '100px' } as CSSProperties}
                body={(rowData) => (
                  <ButtonMenu
                    block
                    label="Opciones"
                    icon={PrimeIcons.COG}
                    variant="info"
                    items={[
                      {
                        label: 'Editar',
                        icon: PrimeIcons.PENCIL,
                        command: (e) => {
                          router.push(`/personal/editar/form?id=${rowData?.id}`);
                        },
                      },
                      {
                        label: 'Eliminar',
                        icon: PrimeIcons.TRASH,
                        command: async () => {
                          if (confirm('Esta seguro de eliminar este registro?')) {
                          }
                        },
                      },
                    ]}
                  />
                )}
              />
            </TablaPaginada>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};

export default PersonalPage;
