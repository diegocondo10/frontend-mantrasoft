import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import { urlListarTratamientosPaciente } from '@src/containers/tratamientos/urls';
import { CrudActions } from '@src/emuns/crudActions';
import useCurrentPath from '@src/hooks/useCurrentPath';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDetailPersona } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { CSSProperties } from 'react';
import { useQuery } from 'react-query';

const TratamientosPage: CustomNextPage<{
  crudAction: CrudActions;
  id: number;
  urlListarTratamientos: string;
  pacienteId: string;
}> = ({ id, urlListarTratamientos, pacienteId }) => {
  const { isLoading, data, page, setPage } = usePagination({
    uri: urlListarTratamientos,
    key: [urlListarTratamientos, id],
  });

  const { currentEncodedPath } = useCurrentPath();

  const queryPaciente = useQuery(['paciente', pacienteId], () => API.private().get(urlDetailPersona(id)), {
    refetchOnWindowFocus: false,
  });

  return (
    <PrivateLayout
      title="Tratamientos"
      loading={{
        loading: isLoading === true || queryPaciente.isLoading === true,
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
        <h2 className="text-center">{queryPaciente?.data?.data?.nombresApellidos}</h2>
        <TablaPaginada
          value={data?.data?.data || []}
          first={page}
          rows={data?.data?.pagina?.registrosPorPagina}
          onChangePage={setPage}
          totalRecords={data?.data?.pagina?.registrosTotales}
          loading={isLoading}
          header={
            <div className="d-flex flex-row">
              <span className="p-inputgroup w-full">
                <Button
                  href={`/tratamientos/create/form?idFicha=${id}&back=${currentEncodedPath}`}
                  variant="success"
                  outlined
                  icon={PrimeIcons.PLUS}
                  label="Agregar"
                />
              </span>
            </div>
          }
        >
          {ColumnaNo()}
          <Column header="Fecha inicio" field="fechaInicio" />
          <Column header="Fecha fin" field="fechaFin" />
          <Column header="Asignado por" field="asignadoPor.fullName" />
          <Column
            bodyClassName="p-0 m-0"
            style={{ width: '100px' } as CSSProperties}
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
        </TablaPaginada>
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

export default TratamientosPage;
