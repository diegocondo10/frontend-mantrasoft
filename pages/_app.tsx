import '@styles/index.scss';
import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';
import moment from 'moment';
import 'moment/locale/es';
import { AppProps } from 'next/app';
import { addLocale, PrimeReactProvider } from 'primereact/api';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { QueryClient, QueryClientProvider } from 'react-query';
import { defaults } from 'react-sweet-state';
import { ToastProvider } from 'react-toast-notifications';

// Configuración de locales
const configureLocales = () => {
  // Configurar react-datepicker con el locale español
  registerLocale('es', es);
  setDefaultLocale('es');

  // Configurar date-fns con el locale español
  setDefaultOptions({ locale: es });

  // Configurar PrimeReact con el locale español
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

  // Configurar moment con el locale español
  moment.locale('es');
};

// Componente para evitar problemas de hidratación
const Hydration: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    configureLocales();
    defaults.devtools = true;
  }, []);

  return (
    <Hydration>
      <PrimeReactProvider value={{ locale: 'es' }}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider autoDismiss autoDismissTimeout={10000} placement="top-right">
            <Component {...pageProps} />
          </ToastProvider>
        </QueryClientProvider>
        {/* {Component?.help && <HelpButton title={Component.help?.title} content={Component?.help?.content} />} */}
      </PrimeReactProvider>
    </Hydration>
  );
}

export default MyApp;
