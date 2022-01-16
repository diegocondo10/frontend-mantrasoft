import Button from '@src/components/Button';
import DetallePaciente from '@src/containers/horarios/DetallePaciente';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlDetalleHorario } from '@src/services/urls';
import moment from 'moment';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import React, { useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import ReactToPrint from 'react-to-print';

const DetalleHorarioPage: NextPage<any> = ({ id, startDate, endDate }) => {
  const query = useQuery(['horario', 'detalle', id, startDate, endDate], () =>
    API.private().get(urlDetalleHorario(id, startDate, endDate)),
  );

  const documentTitle = useMemo(
    () => `${moment(startDate).format('DD [de] MMMM [de] YYYY')} - ${moment(endDate).format('DD [de] MMMM [de] YYYY')}`,
    [startDate, endDate],
  );

  const fechas: any[] = query?.data?.data;

  const componentRef = useRef(null);

  return (
    <PrivateLayout>
      <main className="container-fluid">
        <div className="row justify-content-center" ref={componentRef}>
          <div className="col-12 text-center">
            <h4>
              Horario: {documentTitle}{' '}
              <ReactToPrint
                documentTitle={documentTitle}
                copyStyles
                pageStyle={`
                  @media print {
                    @page {
                      size: portrait !important;
                    }
                  }
                `}
                trigger={() => <Button icon={PrimeIcons.PRINT} outlined rounded tooltip="Imprimir Reporte del día" />}
                content={() => componentRef.current}
              />
            </h4>
          </div>
          <div className="col-12 lg:col-11">
            <ul className="list-group list-group-flush w-full">
              {fechas?.length > 0 &&
                fechas?.map((item) => (
                  <React.Fragment key={item?.fecha}>
                    {item?.habitaciones?.length > 0 && (
                      <li className="list-group-item">
                        <h6>
                          <strong>
                            Fecha: {item?.fecha} | {item?.nombre} | Jornada: {item?.jornada?.codigo}
                          </strong>
                        </h6>
                        <ul className="px-0 list-unstyled">
                          {item?.habitaciones?.map((habitacion) => (
                            <li key={habitacion?.id}>
                              <h6>
                                <strong>Habitación: {habitacion?.habitacion}</strong>
                              </h6>
                              <DetallePaciente habitacion={habitacion} fecha={item?.fecha} />
                            </li>
                          ))}
                        </ul>
                      </li>
                    )}
                  </React.Fragment>
                ))}
            </ul>
          </div>
        </div>
      </main>
    </PrivateLayout>
  );
};

DetalleHorarioPage.getInitialProps = ({ query }) => query as any;
DetalleHorarioPage.help = {
  title: 'Detalle del horario',
  content: <React.Fragment></React.Fragment>,
};
export default DetalleHorarioPage;
