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
const TRATAMIENTOS_BASE = `tratamientos-base/`;
const SIGNO_VITALES = 'signos-vitales/';
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
export const urlPersonalAutorizadoMedicamentos = `${MEDICAMENTOS}personal-autorizado/`;
export const urlMedicamentosLabelValue = `${MEDICAMENTOS}label-value/`;

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

export const urlInfoPacienteByIdFicha = (id) => `${urlUpdateFichasIngreso(id)}info-paciente-signos/`;
export const urlSignosPorSemana = (week: string, pacienteId: any) => {
  return `${SIGNO_VITALES}info-semana/${week}/${pacienteId}/`;
};

export const urlImprimirReporteSignosVitalesSemana = (week: string, pacienteId: any) => {
  return `${SIGNO_VITALES}imprimir-reporte-semanal/${week}/${pacienteId}/`;
};

export const urlRegistrarSignoVital = `signos-vitales/registrar/`;
export const urlGetSignos = (fecha: any, paciente: any) => {
  return `signos-vitales/get-signos/${fecha}/${paciente}/`;
};
export const urlGetSignoVital = (fecha: any, paciente: any, tipo: any) => {
  return `signos-vitales/${fecha}/${paciente}/${tipo}/`;
};

export const urlResumenEnfermera = (pacienteId: any, fecha: string) => {
  return `${FICHAS_INGRESO}resumen/${pacienteId}/${fecha}`;
};

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
export const urlDeleteUsuarios = urlUpdateUsuarios;
export const urlDetailUsuarios = urlUpdateUsuarios;
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
export const urlGetTratamientoInicial = (idFicha: any) => `${TRATAMIENTOS_BASE}${idFicha}/`;
export const urlCreateOrUpdateTratamientoInicial = urlGetTratamientoInicial;
export const urlMedicamentosPaciente = (fecha: any) => `${TRATAMIENTOS_BASE}medicamentos/${fecha}/`;
export const urlRegistrarMedicacion = (idPaciente: any) => `${TRATAMIENTOS_BASE}registrar-medicacion/${idPaciente}/`;
