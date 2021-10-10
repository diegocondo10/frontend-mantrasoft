import Button from '@src/components/Button';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import React, { useMemo } from 'react';

const PrivateNavbar = () => {
  const router = useRouter();

  const mappItem = (item: MenuItem) => ({
    ...item,
    command: () => {
      if (item.url) {
        router.push(item.url);
      }
    },
    url: undefined,
    items: item?.items?.map?.(mappItem) || undefined,
  });

  const model = useMemo<MenuItem[]>(
    (): MenuItem[] =>
      [
        {
          icon: PrimeIcons.HOME,
          label: 'Inicio',
          url: '/',
        },
        {
          icon: PrimeIcons.USERS,
          label: 'Personas',
          url: '/personas/',
        },
        {
          icon: PrimeIcons.FOLDER,
          label: 'Catalogos',
          items: [
            {
              label: 'Habitaciones',
              icon: PrimeIcons.LIST,
              url: '/habitaciones/',
            },
            {
              label: 'Medicamentos',
              icon: PrimeIcons.LIST,
              url: '/medicamentos/',
            },
          ],
        },
      ].map(mappItem),
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
