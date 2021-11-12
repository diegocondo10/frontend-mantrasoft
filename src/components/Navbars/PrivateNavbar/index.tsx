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
          icon: PrimeIcons.FOLDER,
          label: 'Catalogos',
          items: [
            {
              icon: PrimeIcons.USERS,
              label: 'Personas',
              url: '/personas/',
            },
            {
              label: 'Habitaciones',
              icon: PrimeIcons.LIST,
              url: '/habitaciones/',
            },
            {
              label: 'Horarios',
              icon: PrimeIcons.LIST,
              url: '/horarios/',
            },
            {
              label: 'Medicamentos',
              icon: PrimeIcons.LIST,
              url: '/medicamentos/',
            },
          ],
        },
        {
          icon: PrimeIcons.FOLDER,
          label: 'Fichas',
          items: [
            { label: 'Ingreso', icon: PrimeIcons.FILE, url: '/fichas/ingreso' },
            { label: 'Pacientes', icon: PrimeIcons.FILE, url: '/fichas/medicacion' },
          ],
        },
        {
          icon: PrimeIcons.LOCK,
          label: 'Auditoria',
          items: [
            {
              label: 'Permisos',
              icon: PrimeIcons.LOCK,
              url: '/auditoria/permisos/',
            },
            {
              label: 'Roles del sistema',
              icon: PrimeIcons.LIST,
              url: '/auditoria/roles-sistema/',
            },
            {
              label: 'Usuarios',
              icon: PrimeIcons.USERS,
              url: '/auditoria/usuarios/',
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
