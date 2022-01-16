import Button from '@src/components/Button';
import Modal from '@src/components/Modal';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';

const ModalMedicacion = ({ medicamentos, loadingMedicamentos }) => {
  const [show, setShow] = useState(false);

  return (
    <React.Fragment>
      <Button
        label="Medicamentos"
        icon={PrimeIcons.INFO}
        onClick={() => setShow(true)}
        loading={loadingMedicamentos}
        outlined
        variant="info"
      />
      <Modal show={show} onHide={() => setShow(false)} header={{ closeButton: true, title: 'Medicación' }}>
        <code>{JSON.stringify(medicamentos)}</code>
      </Modal>
    </React.Fragment>
  );
};

export default ModalMedicacion;
