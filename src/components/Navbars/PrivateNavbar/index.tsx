import Button from '@src/components/Button';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import React, { useMemo } from 'react';

const PrivateNavbar = () => {
  const router = useRouter();

  const model = useMemo<MenuItem[]>(
    () =>
      [
        {
          icon: PrimeIcons.USERS,
          label: 'Personas',
          url: '/personas/',
        },
      ].map((item) => ({
        ...item,
        command: () => {
          if (item.url) {
            router.push(item.url);
          }
        },
        url: undefined,
      })),
    [],
  );

  return (
    <Menubar
      model={model}
      end={
        <React.Fragment>
          <Button outlined sm label="Salir" icon={PrimeIcons.POWER_OFF} variant="danger" href="/logout" />
        </React.Fragment>
      }
    />
  );
};

export default PrivateNavbar;
