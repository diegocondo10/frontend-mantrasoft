import Button from '@src/components/Button';
import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import React from 'react';

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
          <Button outlined sm label="Salir" icon={PrimeIcons.POWER_OFF} variant="danger" href="/logout" />
        </React.Fragment>
      }
    />
  );
};

export default PrivateNavbar;
