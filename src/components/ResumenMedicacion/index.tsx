import { FichaIngresoService } from '@src/services/fichaIngreso/fichaIngreso.service';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { ChangeEvent, useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../Button';
import Loading from '../Loading';

const ResumenMedicacion = () => {
  const [pacientes, setPacientes] = useState([]);

  const queryMedicacion = useQuery<any>(
    ['medicacion-paciente-enfermera'],
    () => new FichaIngresoService().listByEnfermera(),
    {
      refetchOnWindowFocus: false,
      onSuccess: ({ data }) => {
        setPacientes(data?.pacientes);
      },
    },
  );

  const onChangeBuscar = (evt: ChangeEvent<HTMLInputElement>) => {
    const result = queryMedicacion.data.data.pacientes.filter((item) => {
      return item.label.toLowerCase().includes(evt.target.value.toLowerCase());
    });
    setPacientes(result);
  };
  return (
    <div className="col-12 mb-5">
      <div className="grid grid-nogutter justify-content-center">
        <div className="col-11 md:col-10 xl:col-8">
          <Loading loading={queryMedicacion.isFetching} texto="Buscando tus pacientes..." />
          {!queryMedicacion.isFetching && (
            <>
              <div className="mb-5">
                <label htmlFor="buscar">Buscar: </label>
                <InputText className="w-15rem md:w-20rem" type="search" onChange={onChangeBuscar} />
              </div>
              <p>Tus pacientes para hoy son:</p>
              {pacientes.map((paciente) => (
                <Button
                  className="text-left my-1"
                  outlined
                  block
                  icon={PrimeIcons.CARET_RIGHT}
                  href={`/pacientes/seguimiento?idFicha=${paciente.id}`}
                >
                  {paciente.label}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumenMedicacion;
