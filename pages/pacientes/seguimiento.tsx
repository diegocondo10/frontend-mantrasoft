import RecordDetail from '@src/components/DeleteRecordConfirm/RecordDetail';
import Medicacion from '@src/containers/pacientes/seguimiento/components/Medicacion';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { FichaIngresoService } from '@src/services/fichaIngreso/fichaIngreso.service';
import { PK } from '@src/types/api';
import { CustomNextPage } from '@src/types/next';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import { Divider } from 'primereact/divider';
import { TabPanel, TabView } from 'primereact/tabview';
import { useQuery } from 'react-query';

const SeguimientoPacientesPage: CustomNextPage<{ idFicha: PK }> = ({ idFicha }) => {
  const queryResumen = useQuery<AxiosResponse<any>>(
    ['resumen-ficha-paciente', idFicha],
    () => new FichaIngresoService().resumenFichaPaciente(idFicha),
    {
      refetchOnWindowFocus: false,
    },
  );

  const resumen = queryResumen.data?.data;

  console.log(resumen);

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
            ]}
          />
        </div>
        <Divider />
        <div className="col-12 mb-8 mx-auto">
          <TabView className="border-1 border-gray-200" panelContainerStyle={{ minHeight: '30rem' }} scrollable>
            <TabPanel header="Tratamiento"></TabPanel>
            <TabPanel header="Medicación">
              <Medicacion paciente={resumen?.paciente} />
            </TabPanel>
            <TabPanel header="Signos Vitales">
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum similique, exercitationem iste
                temporibus eligendi repudiandae veniam, necessitatibus, fuga commodi hic tempore at doloremque rerum
                nesciunt? Quas quasi culpa explicabo porro?
              </p>
            </TabPanel>
            <TabPanel header="Observaciones y anomalias">
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum similique, exercitationem iste
                temporibus eligendi repudiandae veniam, necessitatibus, fuga commodi hic tempore at doloremque rerum
                nesciunt? Quas quasi culpa explicabo porro?
              </p>
            </TabPanel>
          </TabView>
        </div>
      </main>
    </PrivateLayout>
  );
};

SeguimientoPacientesPage.isPrivate = true;

export const getServerSideProps: GetServerSideProps<any> = async ({ query }) => {
  return {
    props: {
      ...query,
    },
  };
};
export default SeguimientoPacientesPage;
