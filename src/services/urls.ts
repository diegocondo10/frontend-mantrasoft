export const URL_BASE = 'http://localhost:8000/';

const USUARIOS = 'usuarios/';
const PERSONAS = 'personas/';
const HABITACIONES = 'habitaciones/';
const MEDICAMENTOS = 'medicamentos/';
const FICHAS_INGRESO = 'fichas-ingreso/';
const ALAS = 'alas/';
/**
 * AUTH
 */
export const urlLogin = `${USUARIOS}login/`;

/**
 * PERSONAS
 */
export const urlListarPersonas = PERSONAS;
export const urlCreatePersona = PERSONAS;
export const urlUpdatePersona = (id: any) => `${PERSONAS}${id}/`;
export const urlDeletePersona = urlUpdatePersona;
export const urlDetailPersona = urlUpdatePersona;

/**
 * ALAS
 */
//LIST PACIENTES
export const urlListadoFilterPacientes = `${ALAS}listado-filter-pacientes/`;

/**
 * HABITACIONES
 */
export const urlListarHabitaciones = HABITACIONES;
export const urlCreateHabitacion = HABITACIONES;
export const urlUpdateHabitacion = (id: any) => `${HABITACIONES}${id}/`;
export const urlDeleteHabitacion = urlUpdateHabitacion;
export const urlDetailHabitacion = urlUpdateHabitacion;

/**
 * MEDICAMENTOS
 */
export const urlListarMedicamentos = MEDICAMENTOS;
export const urlCreateMedicamento = MEDICAMENTOS;
export const urlUpdateMedicamento = (id: any) => `${MEDICAMENTOS}${id}/`;
export const urlDeleteMedicamento = urlUpdateMedicamento;
export const urlDetailMedicamento = urlUpdateMedicamento;

/**
 * FICHAS DE PACIENTES
 */

export const urlListarFichasIngreso = FICHAS_INGRESO;
export const urlCatalogoForm = `${FICHAS_INGRESO}catalogo-form-ficha/`;
export const urlCreateFichasIngreso = FICHAS_INGRESO;
export const urlUpdateFichasIngreso = (id: any) => `${FICHAS_INGRESO}${id}/`;
export const urlDeleteFichasIngreso = urlUpdateFichasIngreso;
export const urlDetailFichasIngreso = urlUpdateFichasIngreso;
