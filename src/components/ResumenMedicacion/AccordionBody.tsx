import { FichaIngresoService } from '@src/services/fichaIngreso/fichaIngreso.service';
import { RegistroMedicacionService } from '@src/services/registroMedicacion/registroMedicacion.service';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../Button';
import Loading from '../Loading';

const AccordionBody = ({ paciente, tiposSuministracion }) => {
  const [show, setShow] = useState(false);
  const [filas, setFilas] = useState({});

  const queryTratamiento = useQuery<any>(
    ['tratamiento-medicacion-resumen', paciente],
    () => new FichaIngresoService().tratamientoMedicacion(paciente.id),
    {
      refetchOnWindowFocus: false,
    },
  );

  const queryRegistro = useQuery<any>(
    ['registro-medicacion', paciente],
    () => new RegistroMedicacionService().registroPaciente(paciente.id),
    {
      onSuccess: ({ data }) => {
        console.log(data);
        setFilas(data);
      },
      refetchOnWindowFocus: false,
    },
  );

  const tratamiento = queryTratamiento.data?.data?.tratamiento;

  if (queryTratamiento.isFetching || queryRegistro.isFetching) {
    return <Loading loading />;
  }

  if (!tratamiento) {
    return <p className="text-red-600 text-3xl">Sin tratamiento y medicación asignada</p>;
  }

  const onChangeEstado = (key: string, record) => (e: DropdownChangeEvent) => {
    setFilas({
      ...filas,
      [key]: e.value,
    });
    const body = {
      idFicha: paciente.id,
      idTratamiento: tratamiento.id,
      idMedicamento: record.id,
      value: e.value,
      hora: record.horaRaw,
    };
    new RegistroMedicacionService().registrar(body);
  };

  return (
    <>
      <Button label="Ver diagnostico" icon={PrimeIcons.EYE} iconPos="right" onClick={() => setShow(true)} outlined />
      <DataTable value={tratamiento.medicamentos} showGridlines size="small">
        <Column
          header="Medicamento"
          field="label"
          style={{ minWidth: '25rem' }}
          body={(record) => (
            <p className="m-0 p-0" style={{ minWidth: '25rem' }}>
              {record.label}
            </p>
          )}
        />
        <Column
          header="Hora"
          field="hora"
          className="text-center font-bold w-7rem"
          body={(record) => <h4 className="w-5rem m-0 p-0">{record.hora}</h4>}
        />
        <Column
          header="Estado"
          className="w-20rem p-0 m-0"
          body={(rowData) => {
            const key = `${rowData.horaRaw}--${rowData.id}--${paciente.id}`;
            return (
              <Dropdown
                className="p-inputtext-sm outline-none shadow-none border-noround dropdown__horario w-full"
                options={tiposSuministracion}
                panelClassName="p-0 m-0 dropdown__horario flex flex-column align-items-center white-space-wrap"
                placeholder="Selececcione..."
                value={filas[key] || null}
                optionValue=""
                onChange={onChangeEstado(key, rowData)}
                itemTemplate={(item) => (
                  <div
                    className="flex flex-column justify-content-center text-center border-1 border-gray-400 w-25rem"
                    style={{
                      backgroundColor: item.color,
                      color: item?.colorLetra,
                      height: '2.3rem',
                    }}
                  >
                    <span>{item.label}</span>
                  </div>
                )}
                valueTemplate={(item) => (
                  <div
                    style={{
                      backgroundColor: item?.color,
                      color: item?.colorLetra,
                      height: '2.3rem',
                    }}
                    className="flex flex-column justify-content-center text-center"
                  >
                    <span>{item?.label || 'Seleccione'}</span>
                  </div>
                )}
              />
            );
          }}
        />
      </DataTable>

      <Dialog
        draggable={false}
        style={{ maxWidth: '50rem' }}
        header="Diagnostico"
        visible={show}
        onHide={() => setShow(false)}
      >
        <h4 className="my-1">Asignado por: {tratamiento?.asignadoPor}</h4>
        <h4 className="my-1">Fecha inicio: {tratamiento.fechaInicio}</h4>
        <h4 className="my-1">Fecha fin: {tratamiento.fechaFin}</h4>
        <h4 className="my-1">Paciente: {paciente.nombre}</h4>
        <p className="text-justify">{queryTratamiento?.data?.data?.tratamiento?.diagnostico}</p>
      </Dialog>
    </>
  );
};

export default AccordionBody;
