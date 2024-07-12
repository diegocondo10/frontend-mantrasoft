import Button from '@src/components/Button';
import useUsuario from '@src/store/usuario/useUsuario';
import classNames from 'classnames';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useMemo, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';
import styles from './styles.module.scss';

const PrivateNavbar = () => {
  const router = useRouter();
  const { activarOptionNavbarByPermiso, usuario } = useUsuario();

  const op = useRef<OverlayPanel>(null);

  const commandPush = (path: string) => (): void => {
    router.push(path);
  };

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
              // ...activarOptionNavbarByPermiso('PERSONAS__LISTAR'),
            },
            {
              label: 'Habitaciones',
              icon: PrimeIcons.LIST,
              url: '/habitaciones/',
              // ...activarOptionNavbarByPermiso('HABITACIONES__LISTAR'),
            },
            {
              label: 'Horarios',
              icon: PrimeIcons.LIST,
              url: '/horarios/',
              // ...activarOptionNavbarByPermiso('HORARIOS__LISTAR')
            },
            {
              label: 'Medicamentos',
              icon: PrimeIcons.LIST,
              url: '/medicamentos/',
              // ...activarOptionNavbarByPermiso('MEDICAMENTOS__LISTAR')
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
              // ...activarOptionNavbarByPermiso('FICHASINGRESO__LISTAR')
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
              // ...activarOptionNavbarByPermiso('PERMISOS__LISTAR'),
            },
            {
              label: 'Roles del sistema',
              icon: PrimeIcons.LIST,
              url: '/auditoria/roles-sistema/',
              // ...activarOptionNavbarByPermiso('ROLES__LISTAR'),
            },
            {
              label: 'Usuarios',
              icon: PrimeIcons.USERS,
              url: '/auditoria/usuarios/',
              // ...activarOptionNavbarByPermiso('USUARIOS__LISTAR'),
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
          <React.Fragment>
            <button
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
              }}
              onClick={(e) => op.current?.toggle?.(e, null)}
            >
              <span className="me-2 text-black">{usuario?.username}</span>
              <i className="pi pi-user cpointer" />
            </button>

            <OverlayPanel ref={op} style={{ width: '300px' }}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 text-center">
                    {usuario?.persona?.foto && (
                      <img
                        className="img-fluid img-thumbnail"
                        style={{ maxHeight: '100px' }}
                        src={usuario?.persona?.foto}
                        alt=""
                      />
                    )}
                    <h5 className="mt-2">{usuario?.username}</h5>
                    <h6 className="mt-2">{usuario?.persona?.display}</h6>
                    <h6 className="mt-2">{usuario?.email}</h6>
                    <h6 className="mt-2">Rol seleccionado: {usuario?.roles?.[0]?.nombre}</h6>
                    <p>{usuario?.persona?.correo}</p>
                  </div>
                </div>
              </div>
              <ListGroup>
                <button className={classNames(styles.list_item, 'my-2')} onClick={commandPush('/perfil/actividad')}>
                  <i className="pi pi-user" /> Mi Actividad
                </button>
                <Button
                  className="btn-logout rounded-0"
                  outlined
                  sm
                  label="Salir"
                  icon={PrimeIcons.POWER_OFF}
                  variant="danger"
                  href="/logout"
                />
              </ListGroup>
            </OverlayPanel>
          </React.Fragment>
        </React.Fragment>
      }
    />
  );
};

export default PrivateNavbar;
