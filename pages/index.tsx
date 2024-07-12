import Button from '@src/components/Button';
import Modal from '@src/components/Modal';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlResumenEnfermera } from '@src/services/urls';
import useUsuario from '@src/store/usuario/useUsuario';
import classNames from 'classnames';
import moment from 'moment';
import type { NextPage } from 'next';
import router from 'next/router';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

const today = moment().format('YYYY-MM-DD');

const Home: NextPage<any> = () => {
  const { usuario } = useUsuario();
  const [fecha, setFecha] = useState(today);

  const [showModal, setShowModal] = useState(false);
  const [pacienteModal, setPacienteModal] = useState(null);

  const query = useQuery(
    ['resumen', usuario?.id, fecha],
    () => API.private().get(urlResumenEnfermera(usuario?.id, fecha)),
    {
      enabled: !!usuario?.id && !!fecha,
      refetchOnWindowFocus: false,
      select: (res) => res.data,
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  const onClick = () => {
    if (fecha !== '') {
      router.push(`/horarios/detalle?id=${usuario?.id}&startDate=${fecha}&endDate=${fecha}`);
    }
  };
  const onClickOpen = (record) => () => {
    setPacienteModal(record);
    setShowModal(true);
  };
  const onClickClose = () => {
    setShowModal(false);
    setPacienteModal(null);
  };

  return (
    <PrivateLayout loading={{ loading: false }}>
      <main className="container">
        <h1 className="display-6 text-center mt-5">Bienvenido</h1>
        <h4 className="text-center">Que deseas hacer?</h4>
        {usuario.isEnfermera && (
          <React.Fragment>
            <div className="row g-1 align-items-center">
              <div className="col-auto">
                <input
                  className="form-control form-control-lg"
                  type="date"
                  value={fecha}
                  defaultValue={today}
                  max={today}
                  onChange={(evt) => setFecha(evt.target.value)}
                />
              </div>
              <div className="col-auto">
                <Button outlined variant="info" label="Consultar mi horario" onClick={onClick} />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h3 className="text-center">Resumen</h3>
              </div>
              {query?.data?.map?.((horario) => (
                <React.Fragment key={horario.id}>
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title">
                          {horario.tituloJornada} | {horario.codigoAla} - {horario.tituloAla}
                        </h4>
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          {horario?.habitaciones?.map?.((habitacion) => (
                            <React.Fragment key={`${horario.id}-${habitacion.id}`}>
                              <li className="list-group-item">
                                <h4 className="font-bold">Habitacion: #{habitacion.numero}</h4>
                                <h5 className="font-bold">Pacientes: </h5>
                                <ul className="list-group">
                                  {habitacion?.pacientes?.map((paciente) => (
                                    <React.Fragment key={paciente.id}>
                                      <li
                                        className={classNames('list-group-item list-group-item-action cursor-pointer', {
                                          active: paciente.id === pacienteModal?.id,
                                        })}
                                        onClick={onClickOpen(paciente)}
                                      >
                                        <strong>
                                          {paciente.identificacion} {paciente.apellidos} {paciente.nombres}
                                        </strong>
                                      </li>
                                    </React.Fragment>
                                  ))}
                                </ul>
                              </li>
                            </React.Fragment>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        )}
        <Modal
          show={showModal}
          onHide={onClickClose}
          modal={{ scrollable: true, centered: true, size: 'lg' }}
          header={{
            closeButton: true,
            title: `${pacienteModal?.identificacion} ${pacienteModal?.apellidos} ${pacienteModal?.nombres}`,
          }}
        >
          <h4 className="font-bold">Diagnostico del tratamiento:</h4>
          <p>{pacienteModal?.tratamiento?.diagnostico}</p>
          <h4 className="font-bold">Medicamentos:</h4>
          <ul className="list-group">
            {pacienteModal?.tratamiento?.medicamentos?.map?.((medicamento) => (
              <React.Fragment key={medicamento.id}>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <h5 className="fw-bold">{medicamento.nombre}</h5>
                    <ul>
                      {medicamento?.horas?.map((hora) => (
                        <li key={hora}>{hora}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="badge bg-primary rounded-pill py-2">{medicamento.frecuencia}</span>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </Modal>
      </main>
    </PrivateLayout>
  );
};
Home.isPrivate = true;
Home.help = {
  title: 'Pagina de inicio',
  content: 'Dashboard de presentación de la página',
};
export default Home;
