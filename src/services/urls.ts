export const URL_BASE = 'http://localhost:8000/';

const USUARIOS = 'usuarios/';
const PERSONAS = 'personas/';
const HABITACIONES = 'habitaciones/';
const MEDICAMENTOS = 'medicamentos/';

/**
 * AUTH
 */
export const urlLogin = `${USUARIOS}login/`;

/**
 * PERSONAS
 */
export const urlListarPersonas = PERSONAS;

/**
 * HABITACIONES
 */
export const urlListarHabitaciones = HABITACIONES;

/**
 * MEDICAMENTOS
 */
export const urlListarMedicamentos = MEDICAMENTOS;
export const urlCreateMedicamento = MEDICAMENTOS;
export const urlUpdateMedicamento = (id: any) => `${MEDICAMENTOS}${id}/`;
export const urlDeleteMedicamento = urlUpdateMedicamento;
export const urlDetailMedicamento = urlUpdateMedicamento;
