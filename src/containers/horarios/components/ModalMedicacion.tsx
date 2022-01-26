import Button from '@src/components/Button';
import Modal from '@src/components/Modal';
import classNames from 'classnames';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import HeaderMedicamentoModal from './HeaderMedicamentoModal';
import HoraMedicacion from './HoraMedicacion';

const ModalMedicacion = ({ medicacion, loadingMedicamentos, paciente }) => {
  const [show, setShow] = useState(false);

  const queryClient = useQueryClient();
  const isLoading = queryClient.isFetching(['medicamentos', medicacion?.ids]) === 1;

  return (
    <React.Fragment>
      <Button
        label="Medicamentos"
        icon={PrimeIcons.INFO}
        onClick={() => setShow(true)}
        loading={loadingMedicamentos}
        outlined
        variant="info"
        className=""
      />
      <Modal
        modal={{ scrollable: true, size: 'xl', centered: true }}
        show={show}
        onHide={() => setShow(false)}
        header={{ closeButton: !isLoading, title: 'Medicación' }}
      >
        {medicacion?.medicamentos?.map?.((medicamento, index) => (
          <React.Fragment key={medicamento?.id}>
            <HeaderMedicamentoModal
              medicamento={medicamento}
              index={index}
              paciente={paciente}
              medicacion={medicacion}
            />
            <div>
              {medicamento?.horas?.map((hora) => (
                <HoraMedicacion
                  key={hora?.horaStr}
                  {...hora}
                  isLoading={isLoading}
                  medicacion={medicacion}
                  paciente={paciente}
                  medicamento={medicamento}
                />
              ))}
            </div>
            <hr />
          </React.Fragment>
        ))}
      </Modal>
    </React.Fragment>
  );
};

export default ModalMedicacion;
