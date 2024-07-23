export const urlListarTratamientosPaciente = (idPaciente: string) => `tratamientos/?paciente=${idPaciente}`;

export const urlMedicamentos = `medicamentos/label-value/`;
export const urlFrecuencias = `medicamentos/frecuencias/`;
export const urlTratamiento = (pk) => `tratamientos/${pk}/`;
export const urlCrearTratamiento = `tratamientos/`;
export const urlEditarTratamiento = (pk) => `tratamientos/${pk}/`;
