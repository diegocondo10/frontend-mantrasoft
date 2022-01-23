import Button from '@src/components/Button';
import Modal from '@src/components/Modal';
import classNames from 'classnames';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
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
          <div key={medicamento?.id}>
            <h4
              className={classNames({
                'text-danger': medicamento?.isAtraso,
                'text-info': medicamento?.isProximo,
              })}
            >
              {index + 1}. {medicamento?.medicamento?.label} {medicamento?.isAtraso && '(Atrasado)'}{' '}
              {medicamento?.isProximo && '(Proximo)'}
            </h4>
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
          </div>
        ))}
      </Modal>
    </React.Fragment>
  );
};

export default ModalMedicacion;
