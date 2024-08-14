import { FichaIngresoService } from '@src/services/fichaIngreso/fichaIngreso.service';
import { PK } from '@src/types/api';

export const REPORTES = {
  fichaIngreso: {
    promise: (id: PK) => new FichaIngresoService().imprimirFicha(id),
    type: 'pdf',
  },
};
