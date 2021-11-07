import moment from 'moment';
export const DATE_FORMAT = 'yyyy-MM-DD';
export const DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm';

export const formatearFechaBackend = (date: any) => moment(date).format(DATE_FORMAT);
export const formatearFechaFronend = (date: any) => moment(date).toDate();
