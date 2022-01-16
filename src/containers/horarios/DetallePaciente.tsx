import API from '@src/services/api';
import { urlMedicamentosPaciente } from '@src/services/urls';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useQuery } from 'react-query';
import DetallePacienteItem from './DetallePacienteItem';

const DetallePaciente = ({ habitacion, fecha }) => {
  console.log(habitacion);

  const ids = habitacion?.pacientes?.map((item) => item?.id);

  const query = useQuery(
    ['medicamentos', habitacion?.pacientes],
    () => API.private().post(urlMedicamentosPaciente(fecha), { ids }),
    {
      enabled: ids.length > 0,
      refetchOnWindowFocus: true,
      select: (data) => data?.data || {},
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
            medicamentos={query?.data?.[paciente?.id]}
            loadingMedicamentos={query?.isFetching}
          />
        ))}
      </Accordion>
    </React.Fragment>
  );
};

export default DetallePaciente;
