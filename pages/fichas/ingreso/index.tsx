import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import Modal from '@src/components/Modal';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import TablaPaginada from '@src/components/Tables/TablaPaginada';
import usePagination from '@src/hooks/usePagination';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import {
  urlDeleteFichasIngreso,
  urlImprimirControlMedicacion,
  urlImprimirFichaIngreso,
  urlImprimirReporteEnfermeria,
  urlListadoFilterPacientes,
  urlListarFichasIngreso,
} from '@src/services/urls';
import useUsuario from '@src/store/usuario/useUsuario';
import moment from 'moment';
import { NextPage } from 'next';
import router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

const FichasIngresoPage: NextPage<any> = () => {
  const {
    isLoading,
    data,
    page,
    setPage,
    setOrdering,
    ordering,
    search,
    setSearch,
    filters,
    changeFilter,
    setFilters,
    refetch,
  } = usePagination({
    uri: urlListarFichasIngreso,
    key: 'ListadoFichasIngreso',
  });

  const [showModal, setShowModal] = useState(false);
  const [fecha, setFecha] = useState(moment().format('YYYY-MM-DD'));
  const [id, setId] = useState(null);
  const query = useQuery(['alasHabitaciones'], () => API.private().get<any[]>(urlListadoFilterPacientes), {
    refetchOnWindowFocus: false,
  });

  const habitaciones = useMemo(
    () => query?.data?.data?.find?.((ala) => ala.value === filters?.habitacion__ala__id)?.habitaciones || [],
    [filters?.habitacion__ala__id, query?.data?.data],
  );

  const { tienePermiso } = useUsuario();

  useEffect(() => {
    setFilters({
      estado: 'ACTIVOS',
    });
  }, []);

  const cabecera = (
    <div className="d-flex flex-row">
      <span className="p-inputgroup w-full">
        <InputText type="search" placeholder="Buscar" value={search} onChange={setSearch} />
        <Dropdown
          placeholder="Seleccione un estado"
          name="estado"
          options={['ACTIVOS', 'INACTIVOS']}
          value={filters.estado}
          onChange={changeFilter}
        />
        <Dropdown
          placeholder="Seleccione el ala"
          name="habitacion__ala__id"
          showClear
          options={query?.data?.data || []}
          value={filters?.habitacion__ala__id}
          onChange={(e) => {
            if (!e.target.value) {
              filters.habitacion__id = null;
            }
            setFilters({
              ...filters,
              habitacion__ala__id: e.target.value,
            });
          }}
        />
        <Dropdown
          placeholder="Seleccione la habitación"
          name="habitacion__id"
          showClear
          disabled={!filters?.habitacion__ala__id}
          options={habitaciones}
          value={filters.habitacion__id}
          onChange={changeFilter}
        />
      </span>
    </div>
  );

  return (
    <PrivateLayout
      title="Fichas de Ingreso"
      loading={{
        loading: isLoading || query.isLoading,
      }}
    >
      <main className="container-fluid">
        <h1 className="text-center my-5">
          Fichas de Ingreso
          <Button
            href="/fichas/ingreso/create/form"
            variant="success"
            sm
            rounded
            icon={PrimeIcons.PLUS}
            tooltip="Agregar Registro"
            disabled={!tienePermiso('FICHAINGRESO_AGREGAR')}
          />
        </h1>

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
            loading={isLoading}
          >
            {ColumnaNo()}
            <Column header="Código" field="id" sortable />
            <Column header="Paciente" field="pacienteView.str" sortable />
            <Column header="Ala" field="habitacionView.ala.str" sortable />
            <Column header="Habitación" field="habitacionView.numero" sortable />
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
                      label: 'Dar de alta',
                      icon: PrimeIcons.ANGLE_DOUBLE_RIGHT,
                      command: async () => {
                        if (confirm('Esta seguro en dar de alta a este paciente?')) {
                          await refetch();
                        }
                      },
                      disabled: !tienePermiso('DAR_ALTA'),
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
                        {
                          label: 'Control de medicación',
                          icon: PrimeIcons.PRINT,
                          command: () => {
                            setShowModal(true);
                            setId(rowData.id);
                          },
                        },
                      ],
                    },
                    {
                      label: 'Tratamiento inicial',
                      items: [
                        {
                          label: 'Ingresar tratamiento inicial',
                          icon: PrimeIcons.LIST,
                          command: () => {
                            router.push(`/fichas/ingreso/tratamiento/inicial?idFicha=${rowData.id}`);
                          },
                        },
                      ],
                    },
                    {
                      label: 'Bitacora de enfermeria',
                      icon: PrimeIcons.LIST,
                      command: () => {
                        router.push(`/fichas/ingreso/seguimientos?id=${rowData.id}`);
                      },
                    },
                    {
                      label: 'Signo vitales',
                      icon: PrimeIcons.LIST,
                      command: () => {
                        router.push(`/fichas/ingreso/signos-vitales?id=${rowData.id}`);
                      },
                    },
                    {
                      label: 'Registro de pertenencias',
                      icon: PrimeIcons.LIST,
                      command: () => {
                        router.push(`/fichas/ingreso/pertenencias?id=${rowData.id}`);
                      },
                    },
                    {
                      label: 'Editar',
                      icon: PrimeIcons.PENCIL,
                      command: () => {
                        router.push(`/fichas/ingreso/editar/form?id=${rowData?.id}`);
                      },
                    },
                    {
                      label: 'Eliminar',
                      icon: PrimeIcons.TRASH,
                      command: async () => {
                        if (confirm('Esta seguro de eliminar esta ficha?')) {
                          await API.private().delete(urlDeleteFichasIngreso(rowData.id));
                          await refetch();
                        }
                      },
                    },
                  ]}
                />
              )}
            />
          </TablaPaginada>
        </div>
        <Modal
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
        </Modal>
      </main>
    </PrivateLayout>
  );
};

export default FichasIngresoPage;
