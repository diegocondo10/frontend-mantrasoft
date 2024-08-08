import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import { urlListarTratamientosPaciente } from '@src/containers/tratamientos/urls';
import { CrudActions } from '@src/emuns/crudActions';
import useCurrentPath from '@src/hooks/useCurrentPath';
import usePagination from '@src/hooks/v2/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { FichaIngresoService } from '@src/services/fichaIngreso/fichaIngreso.service';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { useQuery } from 'react-query';

const TratamientosPage: CustomNextPage<{
  crudAction: CrudActions;
  id: number;
  urlListarTratamientos: string;
  pacienteId: string;
}> = ({ id, urlListarTratamientos }) => {
  const pagination = usePagination({
    uri: urlListarTratamientos,
    key: [urlListarTratamientos, id],
  });

  const { currentEncodedPath } = useCurrentPath();

  const queryResumen = useQuery<any>(
    ['resumen-ficha-paciente', id],
    () => new FichaIngresoService().resumenFichaPaciente(id),
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <PrivateLayout
      title="Tratamientos"
      loading={{
        loading: pagination.isLoading || queryResumen.isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Fichas de Ingreso',
          command: commandPush('/fichas/ingreso'),
        },
        {
          label: 'Tratamientos',
        },
      ]}
    >
      <main className="flex flex-column">
        <h1 className="text-center">Tratamientos</h1>
        <p className="text-center text-2xl">
          {queryResumen.data?.data?.paciente?.nombresApellidos}
          <span className="mx-2" />
          {queryResumen.data?.data?.ficha?.ubicacion}
        </p>
        <PaginatedTable
          {...pagination.tableProps}
          header={
            <div className="flex flex-row">
              <Button
                href={`/tratamientos/create/form?idFicha=${id}&back=${currentEncodedPath}`}
                outlined
                className="ml-auto"
                icon={PrimeIcons.PLUS}
                label="Agregar"
              />
            </div>
          }
        >
          <Column header="Estado" field="estado" />
          <Column header="Fecha inicio" field="fechaInicio" />
          <Column header="Fecha fin" field="fechaFin" />
          <Column header="Asignado por" field="asignadoPor.fullName" />
          <Column
            bodyClassName="p-0 m-0 text-center"
            style={{ width: '100px' }}
            header="Opciones"
            body={(rowData) => (
              <ButtonMenu
                items={[
                  {
                    label: 'Editar',
                    icon: PrimeIcons.PENCIL,
                    command: commandPush(
                      `/tratamientos/editar/form?id=${rowData.id}&idFicha=${id}&back=${currentEncodedPath}`,
                    ),
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

TratamientosPage.getInitialProps = ({ query }): any => {
  return {
    id: query.id,
    pacienteId: query?.pacienteId,
    urlListarTratamientos: urlListarTratamientosPaciente(query?.id as string),
  };
};

TratamientosPage.isPrivate = true;

export default TratamientosPage;
