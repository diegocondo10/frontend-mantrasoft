import SignosVitales from '@src/containers/SignosVitales';
import { useParametros } from '@src/hooks/useParametros';
import { FichaIngresoService } from '@src/services/fichaIngreso/fichaIngreso.service';
import { PARAMETROS } from '@src/services/parametro/parametro.enum';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { ChangeEvent, useState } from 'react';
import { useQuery } from 'react-query';
import Loading from '../Loading';
import AccordionBody from './AccordionBody';

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

  const queryParametros = useParametros({
    codigos: [PARAMETROS.MEDICACION_TIPOS_SUMINISTRACION],
  });

  const onChangeBuscar = (evt: ChangeEvent<HTMLInputElement>) => {
    const result = queryMedicacion.data.data.pacientes.filter((item) => {
      return item.label.toLowerCase().includes(evt.target.value);
    });
    setPacientes(result);
  };
  return (
    <div className="col-12">
      <div className="grid grid-nogutter justify-content-center">
        <div className="col-11 xl:col-10">
          <Loading loading={queryMedicacion.isFetching} />
          {!queryMedicacion.isFetching && (
            <>
              <div className="mb-5">
                <label htmlFor="buscar">Buscar: </label>
                <InputText type="search" onChange={onChangeBuscar} />
              </div>
              
              <Accordion>
                {pacientes?.map((item) => (
                  <AccordionTab key={item.id} header={item.label}>
                    <Accordion multiple>
                      <AccordionTab header="Registro de medicación">
                        <AccordionBody
                          paciente={item}
                          tiposSuministracion={queryParametros?.data?.MEDICACION_TIPOS_SUMINISTRACION}
                        />
                      </AccordionTab>
                      <AccordionTab header="Signos vitales">
                        <SignosVitales />
                      </AccordionTab>
                      <AccordionTab header="Anomalias y observaciones"></AccordionTab>
                    </Accordion>
                  </AccordionTab>
                ))}
              </Accordion>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumenMedicacion;
