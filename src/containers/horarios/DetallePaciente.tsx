import API from '@src/services/api';
import { urlMedicamentosPaciente } from '@src/services/urls';
import moment from 'moment';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useQuery } from 'react-query';
import DetallePacienteItem from './DetallePacienteItem';

export type StatusMedicacion = 'A' | 'N' | null;
const DetallePaciente = ({ habitacion, fecha }) => {
  const ids = habitacion?.pacientes?.map((item) => item?.id);

  const query = useQuery(
    ['medicamentos', ids],
    () =>
      API.private().post(urlMedicamentosPaciente(fecha), {
        ids,
        horaActual: moment().format('HH:mm:[00]'),
      }),
    {
      enabled: ids.length > 0,
      refetchOnWindowFocus: true,
      // refetchInterval: 5000,
      select: (data) => data?.data,
    },
  );

  return (
    <React.Fragment>
      <h6 className="text-center">
        <strong>Pacientes</strong>
      </h6>
      <Accordion>
        {habitacion?.pacientes?.map((paciente, index) => (
          <DetallePacienteItem
            key={paciente.id}
            paciente={paciente}
            index={index}
            medicacion={query?.data?.[paciente?.id]}
            loadingMedicamentos={query?.isFetching}
          />
        ))}
      </Accordion>
    </React.Fragment>
  );
};

export default DetallePaciente;
