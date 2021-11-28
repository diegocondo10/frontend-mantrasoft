import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlSeguimientosEnfermeriaPaciente } from '@src/services/urls';
import classNames from 'classnames';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { CSSProperties } from 'react';
import { useQuery } from 'react-query';

const SeguimientosPage: NextPage<{ id: string; tipo: string }> = ({ id, tipo }) => {
  const query = useQuery(['seguimientos-paciente', id], () => API.private().get(urlSeguimientosEnfermeriaPaciente(id)));
  console.log(query);
  return (
    <PrivateLayout title="Anomalias">
      <main className="container-fluid">
        <div className="row">
          <div className="col-12 text-center">
            <h1>
              <Button rounded outlined icon={PrimeIcons.ARROW_LEFT} href="/fichas/ingreso" />
              Registro de anomalias
            </h1>
          </div>
          <div className="col-12">
            <DataTable className="p-datatable-gridlines p-datatable-sm" rowHover autoLayout value={query?.data?.data}>
              {ColumnaNo({ width: '80px' })}
              <Column
                header="Enfermera"
                field="enfermera.label"
                headerClassName="text-center"
                bodyClassName="text-center"
                style={{ width: '20rem ' } as CSSProperties}
              />
              <Column
                header="Tipo"
                field="tipo"
                headerClassName="text-center"
                bodyClassName="text-center font-bold"
                style={{ width: '100px' } as CSSProperties}
              />
              <Column
                header="Fecha"
                field="fecha"
                headerClassName="text-center"
                bodyClassName="text-center"
                style={{ width: '100px' } as CSSProperties}
              />
              <Column
                header="Hora"
                field="hora"
                headerClassName="text-center"
                bodyClassName="text-center"
                style={{ width: '100px' } as CSSProperties}
              />
              <Column header="Observaciones" field="observaciones" headerClassName="text-center" />
              <Column
                header={<i className={PrimeIcons.COG} />}
                headerClassName="text-center"
                className="p-0 m-0"
                style={{ width: '100px' } as CSSProperties}
                body={(rowData) => (
                  <ButtonMenu
                    className="rounded-0 outline-none"
                    block
                    text
                    label="Opciones"
                    variant="info"
                    icon={PrimeIcons.COG}
                    sm
                    outlined
                    items={[
                      {
                        label: 'Tratamientos',
                        icon: PrimeIcons.INFO_CIRCLE,
                      },
                      {
                        label: 'Asignar tratamiento',
                        icon: PrimeIcons.PLUS,
                      },
                    ]}
                  />
                )}
              />
            </DataTable>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};

SeguimientosPage.getInitialProps = ({ query }) => query as any;
export default SeguimientosPage;
