import Button from '@src/components/Button';
import useUsuario from '@src/store/usuario/useUsuario';
import { commandPush } from '@src/utils/router';
import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useMemo, useRef } from 'react';

const PrivateNavbar = () => {
  const { usuario } = useUsuario();

  const op = useRef<OverlayPanel>(null);

  const mappItem = (item: MenuItem) => ({
    ...item,
    command: item.url ? commandPush(item.url) : undefined,
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
          label: 'Usuarios',
          icon: PrimeIcons.USERS,
          url: '/auditoria/usuarios/',
          visible: usuario.isAdmin,
        },
        {
          label: 'Horarios',
          icon: PrimeIcons.CLOCK,
          url: '/horarios/asignacion',
          visible: usuario.isAdmin,
        },
        {
          icon: PrimeIcons.FOLDER,
          label: 'Catalogos',
          visible: usuario.isAdmin,
          items: [
            {
              label: 'Habitaciones',
              icon: PrimeIcons.BUILDING,
              url: '/habitaciones/',
              visible: usuario.isAdmin,
            },

            {
              label: 'Medicamentos',
              icon: PrimeIcons.LIST,
              url: '/medicamentos/',
              visible: usuario.isAdmin,
            },
          ],
        },
        {
          icon: PrimeIcons.FOLDER,
          label: 'Fichas',
          visible: usuario.isAdmin,
          items: [
            {
              icon: PrimeIcons.USERS,
              label: 'Pacientes',
              url: '/personas/',
              visible: usuario.isAdmin,
            },
            {
              label: 'Ingreso',
              icon: PrimeIcons.FILE,
              url: '/fichas/ingreso',
              visible: usuario.isAdmin,
            },
          ],
        },
      ].map(mappItem),
    [],
  );

  return (
    <Menubar
      model={model}
      className="shadow border-noround"
      end={
        <React.Fragment>
          <button
            className="border-none outline-none cursor-pointer py-3 px-5 font-bold bg-gray-100"
            onClick={(e) => op.current?.toggle?.(e, null)}
          >
            <p className="my-0 p-0 text-black text-gray-600">
              {usuario?.username} <i className={PrimeIcons.USER} />
            </p>
          </button>

          <OverlayPanel ref={op} style={{ width: '300px' }}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 text-center">
                  <h4 className="mt-2">{usuario?.username}</h4>
                  <h4 className="mt-2">{usuario?.fullName}</h4>
                  <h4 className="mt-2">{usuario?.email}</h4>
                  <h4 className="mt-2">{usuario?.rol?.nombre}</h4>
                </div>
              </div>
            </div>

            <Button
              className="btn-logout rounded-0"
              outlined
              sm
              label="Salir"
              icon={PrimeIcons.POWER_OFF}
              variant="danger"
              href="/logout"
              block
            />
          </OverlayPanel>
        </React.Fragment>
      }
    />
  );
};

export default PrivateNavbar;
