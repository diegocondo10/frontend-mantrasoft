import Loading from '@src/components/Loading';
import CONFIGS from '@src/constants/configs';
import useUsuario from '@src/store/usuario/useUsuario';
import { CustomAppProps } from '@src/types/next';
import '@styles/index.scss';
import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';
import Cookies from 'js-cookie';
import moment from 'moment';
import 'moment/locale/es';
import Router from 'next/router';
import { addLocale, PrimeReactProvider } from 'primereact/api';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { defaults } from 'react-sweet-state';
import { ToastProvider } from 'react-toast-notifications';

const configureLocales = () => {
  registerLocale('es', es);
  setDefaultLocale('es');

  setDefaultOptions({ locale: es });

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    apply: 'Aplicar',
  });

  moment.locale('es');
};

const Hydration: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return children;
};

const AuthHydratation: React.FC<PropsWithChildren & { isPrivate: boolean }> = ({ children, isPrivate }) => {
  const [loading, setLoading] = useState(true);
  const { setUsuario } = useUsuario();

  const init = async () => {
    if (isPrivate) {
      const userCookie = Cookies.get(CONFIGS.USER_KEY);
      if (userCookie) {
        try {
          const user = JSON.parse(userCookie);
          setUsuario(user);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing user cookie', error);
        }
      }
      await Router.replace('/logout');
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return <Loading loading={loading}>{children}</Loading>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const MyApp: React.FC<CustomAppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    configureLocales();
    defaults.devtools = true;
  }, []);

  return (
    <Hydration>
      <AuthHydratation isPrivate={Component.isPrivate}>
        <QueryClientProvider client={queryClient}>
          <PrimeReactProvider value={{ locale: 'es' }}>
            <ToastProvider autoDismiss autoDismissTimeout={10000} placement="top-right">
              <Component {...pageProps} />
              <Toaster />
            </ToastProvider>
          </PrimeReactProvider>
        </QueryClientProvider>
      </AuthHydratation>
    </Hydration>
  );
};

export default MyApp;
