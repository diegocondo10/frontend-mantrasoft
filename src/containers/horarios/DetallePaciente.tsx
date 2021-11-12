import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import DetallePacienteItem from './DetallePacienteItem';
const DetallePaciente = ({ habitacion }) => {
  return (
    <React.Fragment>
      <h6 className="text-center">
        <strong>Pacientes</strong>
      </h6>
      <Accordion>
        {habitacion?.pacientes?.map((paciente, index) => (
          <DetallePacienteItem key={paciente.id} paciente={paciente} index={index} />
        ))}
      </Accordion>
    </React.Fragment>
  );
};

export default DetallePaciente;
