import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import PageTitle from '@src/components/PageTitle';
import MultiSelectFilter from '@src/components/Tables/filters/MultiSelectFilter';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import usePagination from '@src/hooks/v2/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { AlaService } from '@src/services/alas/ala.service';
import API from '@src/services/api';
import { PersonaService } from '@src/services/persona/persona.service';
import { urlImprimirFichaIngreso, urlImprimirReporteEnfermeria, urlListarFichasIngreso } from '@src/services/urls';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { CSSProperties } from 'react';
import { useQuery } from 'react-query';

const FichasIngresoPage: CustomNextPage = () => {
  const pagination = usePagination({
    uri: urlListarFichasIngreso,
    key: 'ListadoFichasIngreso',
    defaultFilters: {
      paciente: {
        value: [],
        matchMode: FilterMatchMode.IN,
      },
      habitacion: {
        value: [],
        matchMode: FilterMatchMode.IN,
      },
    },
  });

  const queryPersonas = useQuery(['personas-label-value'], () => new PersonaService().labelValue(), {
    refetchOnWindowFocus: false,
  });

  const queryAlas = useQuery(['alas-label-value-habitacion'], () => new AlaService().labelValueWithHabitaciones(), {
    refetchOnWindowFocus: false,
  });

  const cabecera = (
    <div className="flex flex-wrap lg:justify-content-between">
      <Button className="ml-auto" href="/fichas/ingreso/create/form" outlined icon={PrimeIcons.PLUS} label="Agregar" />
    </div>
  );

  return (
    <PrivateLayout
      title="Fichas de Ingreso"
      loading={{
        loading: pagination.isLoading,
      }}
      breadCrumbItems={[
        {
          label: 'Fichas de Ingreso',
        },
      ]}
    >
      <main className="flex flex-column">
        <PageTitle>Fichas de ingreso</PageTitle>

        <PaginatedTable header={cabecera} {...pagination.tableProps}>
          <Column header="Código" field="id" sortable />
          <Column
            header="Paciente"
            field="paciente.str"
            sortable
            sortField="paciente"
            filter
            filterPlaceholder="Buscar"
            showFilterMenu={false}
            filterField="paciente"
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                options={queryPersonas?.data?.data}
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
          />
          <Column
            header="Habitación"
            field="habitacion.str"
            sortField="habitacion"
            sortable
            filter
            filterPlaceholder="Buscar"
            showFilterMenu={false}
            filterField="habitacion"
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                options={queryAlas?.data?.data}
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionValue="value"
                filter
                filterMatchMode="contains"
                optionGroupTemplate={(option) => `Habitaciones - ${option.label}`}
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
                    label: 'Tratamientos',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/tratamientos?id=${rowData.id}`),
                  },
                  {
                    label: 'Editar',
                    icon: PrimeIcons.PENCIL,
                    command: commandPush(`/fichas/ingreso/editar/form?id=${rowData?.id}`),
                  },
                  {
                    separator: true,
                  },
                  {
                    label: 'Reportes',
                    icon: PrimeIcons.PRINT,
                    items: [
                      {
                        label: 'Imprimir ficha de ingreso',
                        icon: PrimeIcons.PRINT,
                        command: API.getReporte(urlImprimirFichaIngreso(rowData.id)),
                      },
                      {
                        label: 'Imprimir Reporte de enfermeria',
                        icon: PrimeIcons.PRINT,
                        command: API.getReporte(urlImprimirReporteEnfermeria(rowData.id)),
                      },
                      // {
                      //   label: 'Control de medicación',
                      //   icon: PrimeIcons.PRINT,
                      //   command: () => {
                      //     setShowModal(true);
                      //     setId(rowData.id);
                      //   },
                      // },
                    ],
                  },

                  {
                    label: 'Bitacora de enfermeria',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/fichas/ingreso/seguimientos?id=${rowData.id}`),
                  },
                  {
                    label: 'Signo vitales',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/fichas/ingreso/signos-vitales?id=${rowData.id}`),
                  },
                  {
                    label: 'Registro de pertenencias',
                    icon: PrimeIcons.LIST,
                    command: commandPush(`/fichas/ingreso/pertenencias?id=${rowData.id}`),
                  },
                ]}
              />
            )}
          />
        </PaginatedTable>

        {/* <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          modal={{ size: 'sm', centered: true }}
          header={{ title: 'Control de medicación', closeButton: true }}
        >
          <div className="d-flex">
            <input
              value={fecha}
              onChange={(evt) => {
                setFecha(evt.target.value);
              }}
              className="form-control"
              type="date"
              required
              name="fecha"
            />
            <Button
              type="submit"
              className="rounded-0"
              label="Imprimir"
              sm
              icon={PrimeIcons.PRINT}
              onClick={API.getReporte(
                urlImprimirControlMedicacion(id, +fecha?.split?.('-')?.[1], fecha?.split?.('-')?.[0]),
              )}
            />
          </div>
        </Modal> */}
      </main>
    </PrivateLayout>
  );
};

export default FichasIngresoPage;
