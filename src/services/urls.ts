export const URL_BASE = 'http://localhost:8000/';

const PERMISOS = 'permisos/';
const ROLES_SISTEMA = 'roles-sistema/';
const USUARIOS = 'usuarios/';
const PERSONAS = 'personas/';
const HABITACIONES = 'habitaciones/';
const MEDICAMENTOS = 'medicamentos/';
const FICHAS_INGRESO = 'fichas-ingreso/';
const PERTENENECIAS = 'pertenencias/';
const ALAS = 'alas/';
const HORARIOS = 'horarios/';
const SEGUIMIENTOS_ENFERMERIA = `seguimientos-enfermeria/`;
const TRATAMIENTOS = `tratamientos/`;
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
export const urlCatalogoCreate = `${PERSONAS}catalogo-create/`;

/**
 * ALAS
 */
//LIST PACIENTES
export const urlListadoFilterPacientes = `${ALAS}listado-filter-pacientes/`;

/**
 * HABITACIONES
 */
export const urlListarHabitaciones = HABITACIONES;
export const urlListarAlasLabelValueHabitaciones = `${HABITACIONES}listar-alas/`;
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
 * PACIENTES
 */
//FICHAS DE INGRESO
export const urlListarFichasIngreso = FICHAS_INGRESO;
export const urlCatalogoForm = `${FICHAS_INGRESO}catalogo-form-ficha/`;
export const urlInfoPacienteFichaIngreso = (id: any) => `${FICHAS_INGRESO}${id}/info-paciente/`;
export const urlCreateFichasIngreso = FICHAS_INGRESO;
export const urlUpdateFichasIngreso = (id: any) => `${FICHAS_INGRESO}${id}/`;
export const urlDeleteFichasIngreso = urlUpdateFichasIngreso;
export const urlDetailFichasIngreso = urlUpdateFichasIngreso;
export const urlImprimirFichaIngreso = (id: any) => `${urlUpdateFichasIngreso(id)}imprimir-ficha/`;
export const urlImprimirReporteEnfermeria = (id: any) => `${urlUpdateFichasIngreso(id)}imprimir-reporte-enfermeria/`;
export const urlSeguimientosEnfermeriaPaciente = (id: any) => `${urlUpdateFichasIngreso(id)}seguimientos/`;

//PERTENENCIAS
export const urlListarPertenencias = (id: any) => `${PERTENENECIAS}?id_registro=${id}`;
export const urlCreatePertenencia = PERTENENECIAS;
export const urlUpdatePertenencia = (id: string | any) => `${PERTENENECIAS}${id}/`;

/**
 * AUDITORIA
 */
//PERMISOS
export const urlListarPermisos = PERMISOS;
export const urlCreatePermiso = PERMISOS;
export const urlUpdatePermiso = (id: any) => `${PERMISOS}${id}/`;
export const urlDeletePermiso = urlUpdatePermiso;
export const urlDetailPermiso = urlUpdatePermiso;
//ROLES DEL SISTEMA
export const urlListarRolesSistema = ROLES_SISTEMA;
export const urlCreateRolesSistema = ROLES_SISTEMA;
export const urlCatalogoFormRolesSistema = `${ROLES_SISTEMA}catalogo-form/`;
export const urlUpdateRolesSistema = (id: any) => `${ROLES_SISTEMA}${id}/`;
export const urlDeleteRolesSistema = urlUpdateRolesSistema;
export const urlDetailRolesSistema = urlUpdateRolesSistema;
//USUARIOS
export const urlListarUsuarios = USUARIOS;
export const urlCreateUsuarios = USUARIOS;
export const urlCatalogoFormUsuarios = `${USUARIOS}catalogo-form/`;
export const urlUpdateUsuarios = (id: any) => `${USUARIOS}${id}/`;
export const urlDeleteUsuarios = urlUpdatePermiso;
export const urlDetailUsuarios = urlUpdatePermiso;
export const urlReiniciarPasswordUsuario = (id: any) => `${USUARIOS}${id}/reset-password/`;
export const urlPerfil = `${USUARIOS}perfil/`;

/**
 * HORARIOS
 */
export const urlParametrosGeneracionHorario = `${HORARIOS}parametros-generacion/`;
export const urlConsultarHorarios = (startDate: any, endDate: any) => {
  return `${HORARIOS}personal/${startDate}/${endDate}/`;
};
export const urlUpdateOrCreateHorario = `${HORARIOS}update-or-create/`;
export const urlDetalleHorario = (id: any, startDate: any, endDate: any) => {
  return `${HORARIOS}detalle/${id}/${startDate}/${endDate}/`;
};

/**
 * SEGUIMIENTOS DE ENFERMERIA
 */
export const urlSeguimientosPacienteHorarios = (fecha: string, idPaciente: string | number) => {
  return `${HORARIOS}seguimientos-paciente-horario/${fecha}/${idPaciente}/`;
};
export const urlCreateSeguimientoEnfermeria = SEGUIMIENTOS_ENFERMERIA;
export const urlUpdateSeguimientoEnfermeria = (id: string | number) => {
  return `${SEGUIMIENTOS_ENFERMERIA}${id}/`;
};
export const urlDeleteSeguimientoEnfermeria = urlUpdateSeguimientoEnfermeria;

/**
 *
 * TRATAMIENTOS
 *
 */
export const urlCreateOrUpdateTratamientoInicial = (idFicha: string) => `${TRATAMIENTOS}crear-o-editar/${idFicha}/`;
export const urlGetTratamientoInicial = (idFicha: string) => `${TRATAMIENTOS}inicial-por-id-ficha/${idFicha}/`;
