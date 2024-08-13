import RecordDetail from '@src/components/DeleteRecordConfirm/RecordDetail';
import Medicacion from '@src/containers/pacientes/seguimiento/components/Medicacion';
import ObservacionAnomalia from '@src/containers/pacientes/seguimiento/components/ObservacionAnomalia';
import ProgresoSignosVitales from '@src/containers/pacientes/seguimiento/components/ProgresoSignosVitales';
import RegistroSignosVitales from '@src/containers/pacientes/seguimiento/components/RegistroSignosVitales';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { FichaIngresoService } from '@src/services/fichaIngreso/fichaIngreso.service';
import { PK } from '@src/types/api';
import { CustomNextPage } from '@src/types/next';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import Router, { useRouter } from 'next/router';
import { Divider } from 'primereact/divider';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useQuery } from 'react-query';

const SeguimientoPacientesPage: CustomNextPage<{ idFicha: PK; tab: number }> = ({ idFicha }) => {
  const queryResumen = useQuery<AxiosResponse<any>>(
    ['resumen-ficha-paciente', idFicha],
    () => new FichaIngresoService().resumenFichaPaciente(idFicha),
    {
      refetchOnWindowFocus: false,
    },
  );

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const resumen = queryResumen.data?.data;
  const { query } = useRouter();
  const selectedTab = useMemo(() => Number(query?.tab || 0), [query?.tab]);

  const onTabChange = (evt: TabViewTabChangeEvent) => {
    Router.replace({
      pathname: Router.pathname,
      query: {
        idFicha,
        tab: evt.index,
      },
    });
  };

  return (
    <PrivateLayout
      loading={{
        loading: queryResumen.isFetching,
      }}
      breadCrumbItems={[
        {
          label: 'Seguimiento',
        },
        {
          label: resumen?.paciente?.nombresApellidos,
        },
      ]}
    >
      <main className="grid grid-nogutter mx-4">
        <div className="col-11 md:col-10 lg:col-8 xl:col-6 mt-5">
          <RecordDetail
            items={[
              ['Paciente', resumen?.paciente?.nombresApellidos],
              ['Ubicación', resumen?.ficha?.ubicacion],
              ['Fecha Ingreso', resumen?.ficha?.fechaIngresoFormat],
              [
                'Fecha de consulta',
                <DatePicker
                  className="p-inputtext p-component font-semibold text-center uppercase w-full"
                  calendarClassName="p-input w-full"
                  wrapperClassName="w-full"
                  selected={fechaSeleccionada}
                  onChange={(date: Date) => setFechaSeleccionada(date)}
                  dateFormat="dd-MM-yyyy"
                />,
              ],
            ]}
          />
        </div>
        <Divider />
        <div className="col-12 mb-8 mx-auto">
          <TabView
            className="border-1 border-gray-200"
            panelContainerStyle={{ minHeight: '30rem' }}
            scrollable
            onTabChange={onTabChange}
            activeIndex={selectedTab}
          >
            {/* <TabPanel header="Tratamiento"></TabPanel> */}
            <TabPanel header="Medicación">
              <Medicacion paciente={resumen?.paciente} fechaSeleccionada={fechaSeleccionada} />
            </TabPanel>
            <TabPanel header="Signos Vitales">
              <RegistroSignosVitales idFicha={idFicha} fechaSeleccionada={fechaSeleccionada} />
            </TabPanel>
            <TabPanel header="Progreso">
              <ProgresoSignosVitales idFicha={idFicha} />
            </TabPanel>
            <TabPanel header="Observaciones y anomalias">
              <ObservacionAnomalia idFicha={idFicha} />
            </TabPanel>
          </TabView>
        </div>
      </main>
    </PrivateLayout>
  );
};

SeguimientoPacientesPage.isPrivate = true;

export const getServerSideProps: GetServerSideProps<any> = async ({ query }) => {
  const tab = query?.tab || 0;
  return {
    props: {
      ...query,
      tab,
    },
  };
};
export default SeguimientoPacientesPage;
