import Button from '@src/components/Button';
import Modal from '@src/components/Modal';
import API from '@src/services/api';
import { urlRegistrarMedicacion } from '@src/services/urls';
import classNames from 'classnames';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

const ModalMedicacion = ({ medicacion, loadingMedicamentos, paciente }) => {
  const [show, setShow] = useState(false);

  const queryClient = useQueryClient();
  const isLoading = queryClient.isFetching(['medicamentos', medicacion?.ids]) === 1;

  const [loading, setLoading] = useState(false);

  const onClick = (medicamento, hora) => async () => {
    setLoading(true);
    await API.private().post(urlRegistrarMedicacion(paciente?.id), {
      medicacionBaseId: medicamento?.id,
      hora: hora?.horaStr,
    });
    await queryClient.refetchQueries(['medicamentos', medicacion?.ids]);
    setLoading(false);
  };

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
      <Modal show={show} onHide={() => setShow(false)} header={{ closeButton: !isLoading, title: 'Medicación' }}>
        {medicacion?.medicamentos?.map?.((medicamento, index) => (
          <div key={medicamento?.id}>
            <h5
              className={classNames({
                'text-danger': medicamento?.isAtraso,
                'text-info': medicamento?.isProximo,
              })}
            >
              {index + 1}. {medicamento?.medicamento?.label} {medicamento?.isAtraso && '(Atrasado)'}{' '}
              {medicamento?.isProximo && '(Proximo)'}
            </h5>
            <div>
              {medicamento?.horas?.map((hora) => (
                <h6
                  className={classNames('ms-4 d-flex align-items-center', {
                    'text-danger': hora?.isAtrasada,
                    'text-info': hora?.isProximo,
                    'text-success': hora?.suministrado,
                  })}
                  key={hora?.horaStr}
                >
                  {hora?.horaStr}{' '}
                  <input
                    className="ms-2 my-0 form-check-input"
                    disabled={loading || isLoading}
                    type="checkbox"
                    checked={hora?.suministrado}
                    onChange={onClick(medicamento, hora)}
                  />
                </h6>
              ))}
            </div>
          </div>
        ))}
      </Modal>
    </React.Fragment>
  );
};

export default ModalMedicacion;
