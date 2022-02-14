import Button from '@src/components/Button';
import useUsuario from '@src/store/usuario/useUsuario';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import React, { useMemo } from 'react';

const PrivateNavbar = () => {
  const router = useRouter();
  const { activarOptionNavbarByPermiso } = useUsuario();
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
              ...activarOptionNavbarByPermiso('PERSONAS__LISTAR'),
            },
            {
              label: 'Habitaciones',
              icon: PrimeIcons.LIST,
              url: '/habitaciones/',
              ...activarOptionNavbarByPermiso('HABITACIONES__LISTAR'),
            },
            {
              label: 'Horarios',
              icon: PrimeIcons.LIST,
              url: '/horarios/',
              ...activarOptionNavbarByPermiso('HORARIOS__LISTAR')
            },
            {
              label: 'Medicamentos',
              icon: PrimeIcons.LIST,
              url: '/medicamentos/',
              ...activarOptionNavbarByPermiso('MEDICAMENTOS__LISTAR')
            },
          ],
        },
        {
          icon: PrimeIcons.FOLDER,
          label: 'Fichas',
          items: [
            {
              label: 'Ingreso',
              icon: PrimeIcons.FILE,
              url: '/fichas/ingreso',
              ...activarOptionNavbarByPermiso('FICHASINGRESO__LISTAR')
            },
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
              ...activarOptionNavbarByPermiso('PERMISOS__LISTAR'),
            },
            {
              label: 'Roles del sistema',
              icon: PrimeIcons.LIST,
              url: '/auditoria/roles-sistema/',
              ...activarOptionNavbarByPermiso('ROLES__LISTAR'),
            },
            {
              label: 'Usuarios',
              icon: PrimeIcons.USERS,
              url: '/auditoria/usuarios/',
              ...activarOptionNavbarByPermiso('USUARIOS__LISTAR'),
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
