import Button from '@src/components/Button';
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

const JornadasDialog = ({ jornadas }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        outlined
        icon={PrimeIcons.INFO}
        rounded
        onClick={() => {
          setVisible(true);
        }}
      />
      <Dialog
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        header="Jornadas"
        draggable
      >
        {jornadas.map((jornada) => (
          <div
            key={JSON.stringify(jornada)}
            className="flex flex-row align-items-center border border-1 border-gray-200 my-2 mx-8 justify-content-center px-5"
          >
            <div
              style={{
                backgroundColor: jornada?.color,
                color: jornada?.colorLetra,
                height: '2rem',
                width: '5rem',
              }}
              className="flex flex-column align-content-center"
            >
              <p className="my-auto mx-auto">{jornada.titulo}</p>
            </div>
            <p className="font-bold mx-5">{jornada.ala}</p>
          </div>
        ))}
      </Dialog>
    </>
  );
};

export default JornadasDialog;
