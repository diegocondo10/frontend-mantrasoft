import { PrimeIcons } from 'primereact/api';
import React, { ReactElement, useState } from 'react';
import Button from '../Button';
import Modal from '../Modal';

type HelpButtonProps = {
  title: string;
  content: ReactElement | string;
};
const HelpButton: React.FC<HelpButtonProps> = (props) => {
  const [show, setShow] = useState(false);

  return (
    <React.Fragment>
      <Button
        className="font-bold"
        rounded
        outlined
        onClick={() => setShow(true)}
        style={{ bottom: 10, left: 10, position: 'absolute' }}
        icon={PrimeIcons.QUESTION}
      />
      <Modal show={show} onHide={() => setShow(false)} header={{ title: props.title, closeButton: true }}>
        {typeof props.content === 'string' && <div dangerouslySetInnerHTML={{ __html: props.content }} />}
        {typeof props.content === 'object' && props.content}
      </Modal>
    </React.Fragment>
  );
};

export default HelpButton;
