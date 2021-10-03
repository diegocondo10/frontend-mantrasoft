import { ApolloProvider } from '@apollo/client';
import client from '@src/services/client';
import '@styles/index.scss';
import moment from 'moment';
import 'moment/locale/es';
import { AppProps } from 'next/dist/shared/lib/router/router';
import { addLocale, locale } from 'primereact/api';
import { useEffect } from 'react';
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
  });
  locale('es');
  moment.locale('es');
};

const Hydratation: React.FC = ({ children }) => {
  return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>;
};
export const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    setLocale();
    defaults.devtools = true;
  }, []);

  return (
    <Hydratation>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <ToastProvider autoDismiss autoDismissTimeout={10000} placement="top-left">
            <Component {...pageProps} />
          </ToastProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </Hydratation>
  );
}
export default MyApp;
