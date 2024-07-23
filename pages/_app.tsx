import '@styles/index.scss';
import { es } from 'date-fns/locale/es';
import moment from 'moment';
import 'moment/locale/es';
import { AppProps } from 'next/dist/shared/lib/router/router';
import { addLocale, PrimeReactProvider } from 'primereact/api';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { registerLocale } from 'react-datepicker';
import { QueryClient, QueryClientProvider } from 'react-query';
import { defaults } from 'react-sweet-state';
import { ToastProvider } from 'react-toast-notifications';

const setLocale = () => {
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
  // locale('es');
  moment.locale('es');
};

const Hydratation: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};

export const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    setLocale();
    defaults.devtools = true;
    registerLocale('es', es);
  }, []);

  return (
    <Hydratation>
      <PrimeReactProvider
        value={{
          locale: 'es',
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider autoDismiss autoDismissTimeout={10000} placement="top-right">
            <Component {...pageProps} />
          </ToastProvider>
        </QueryClientProvider>
        {/* {Component?.help && <HelpButton title={Component.help?.title} content={Component?.help?.content} />} */}
      </PrimeReactProvider>
    </Hydratation>
  );
}

export default MyApp;
