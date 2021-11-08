import moment from 'moment';
export const DATE_FORMAT = 'yyyy-MM-DD';
export const DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm';

export const formatearFechaBackend = (date: any) => moment(date).format(DATE_FORMAT);
export const formatearFechaFronend = (date: any) => moment(date).toDate();

export const generarFechasEntre = (startDate: moment.Moment, endDate: moment.Moment) => {
  const now = startDate.clone();
  const fechas = {};
  while (now.isSameOrBefore(endDate)) {
    const values = {
      mesNumber: now.get('M'),
      mesStr: now.format('MMMM').toUpperCase(),
      diaNumber: now.format('DD'),
      diaSemanaStr: now.format('dd').toUpperCase(),
      dateStr: now.format('YYYY-MM-DD'),
    };

    const dias: any[] = fechas?.[values.mesStr]?.dias || [];
    dias.push({
      str: values.diaSemanaStr,
      number: values.diaNumber,
      date: values.dateStr,
    });
    fechas[values.mesStr] = {
      str: values.mesStr,
      number: values.mesNumber,
      dias: dias,
    };
    now.add(1, 'days');
  }
  return fechas;
};
