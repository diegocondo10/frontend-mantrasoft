import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import React from 'react';
import { Button } from 'react-bootstrap';

const PrivateNavbar = () => {
  return (
    <Menubar
      model={[
        {
          icon: PrimeIcons.USERS,
          label: 'Personas',
        },
      ]}
      end={
        <React.Fragment>
          <Button>Salir</Button>
        </React.Fragment>
      }
    />
  );
};

export default PrivateNavbar;
