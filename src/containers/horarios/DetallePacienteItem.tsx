import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import API from '@src/services/api';
import {
  urlCreateSeguimientoEnfermeria,
  urlDeleteSeguimientoEnfermeria,
  urlSeguimientosPacienteHorarios,
  urlUpdateSeguimientoEnfermeria,
} from '@src/services/urls';
import useUsuario from '@src/store/usuario/useUsuario';
import _ from 'lodash';
import moment from 'moment';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { confirmPopup } from 'primereact/confirmpopup';
import { DataTable } from 'primereact/datatable';
import React, { CSSProperties, useState } from 'react';
import { Accordion, Modal } from 'react-bootstrap';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
const DetallePacienteItem = ({ paciente, index }) => {
  const { usuario } = useUsuario();
  const [data, setData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [id, setId] = useState(null);
  const methods = useForm({ mode: 'onChange' });

  const query = useQuery(
    ['seguimientos-paciente', paciente.id, paciente.idHorario],
    () => API.private().get(urlSeguimientosPacienteHorarios(paciente.fecha, paciente.id)),
    {
      enabled: false,
      onSuccess: (res) => {
        setData(res?.data);
      },
    },
  );

  const header = (
    <div>
      <span className="p-buttonset">
        <Button
          icon={PrimeIcons.PLUS}
          outlined
          sm
          label="Registrar anomalia"
          onClick={() => {
            methods.setValue('tipo', 'ANOMALIA');
            setShowModal(true);
          }}
        />
        <Button
          icon={PrimeIcons.PLUS}
          outlined
          sm
          label="Registrar observación"
          onClick={() => {
            methods.setValue('tipo', 'OBSERVACIÓN');
            setShowModal(true);
          }}
        />
      </span>
    </div>
  );

  const onSubmit = async (formData) => {
    setGuardando(true);
    try {
      formData.paciente = paciente.id;
      formData.horario = paciente.idHorario;
      if (!id) {
        formData.hora = moment().format('HH:mm:ss');
        await API.private().post(urlCreateSeguimientoEnfermeria, formData);
      } else {
        await API.private().put(urlUpdateSeguimientoEnfermeria(id), formData);
      }
    } catch (error) {}
    query.refetch();
    setShowModal(false);
    setId(null);
    methods.reset({});
    setGuardando(false);
  };

  return (
    <Accordion.Item eventKey={`${index}-${paciente.id}-${paciente.idHorario}`}>
      <Accordion.Header
        onClick={(evt) => {
          query.refetch();
        }}
      >
        {paciente?.str}
      </Accordion.Header>
      <Accordion.Body className="p-0 m-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <DataTable
                // lazy
                loading={query.isFetching}
                className="p-datatable-gridlines"
                emptyMessage="Sin segumientos"
                value={data}
                autoLayout
                rows={20}
                paginator
                rowHover
                rowsPerPageOptions={[20, 30, 50, 100]}
                sortMode="multiple"
                header={header}
              >
                {ColumnaNo({ width: '80px' })}
                <Column
                  headerClassName="text-center"
                  header={<i className={PrimeIcons.PENCIL} />}
                  style={{ width: '60px' }}
                  bodyClassName="p-0 m-0 text-center"
                  body={(rowData) => (
                    <Button
                      disabled={usuario.id !== rowData?.enfermera?.id}
                      text
                      outlined
                      variant="info"
                      icon={PrimeIcons.PENCIL}
                      onClick={() => {
                        setId(rowData.id);
                        methods.reset(rowData);
                        setShowModal(true);
                      }}
                    />
                  )}
                />
                <Column
                  headerClassName="text-center"
                  header={<i className={PrimeIcons.TRASH} />}
                  style={{ width: '60px' }}
                  bodyClassName="p-0 m-0 text-center"
                  body={(rowData) => {
                    const confirm = (event) => {
                      confirmPopup({
                        target: event.currentTarget,
                        message: 'Esta seguro/a de eliminar este registro?',
                        icon: 'pi pi-exclamation-triangle',
                        acceptClassName: 'p-button-danger',
                        acceptLabel: 'SI',
                        accept: _.throttle(async () => {
                          try {
                            await API.private().delete(urlDeleteSeguimientoEnfermeria(rowData.id));
                            query.refetch();
                          } catch (error) {}
                        }, 100),
                      });
                    };
                    return (
                      <Button
                        disabled={usuario.id !== rowData?.enfermera?.id}
                        text
                        outlined
                        variant="danger"
                        icon={PrimeIcons.TRASH}
                        onClick={confirm}
                      />
                    );
                  }}
                />
                <Column
                  filter
                  sortable
                  header="Hora"
                  style={{ width: '80px' }}
                  field="hora"
                  body={(rowData) => <p style={{ maxWidth: '80px' }}>{rowData.hora}</p>}
                />
                <Column filter sortable header="Tipo" style={{ width: '100px' }} field="tipo" />
                <Column filter sortable header="Enfermera/o" style={{ width: '100px' }} field="enfermera.nombre" />
                <Column
                  filter
                  sortable
                  header="Observación"
                  field="observaciones"
                  style={{ maxWidth: '500px' }}
                  bodyStyle={{ wordBreak: 'break-word' } as CSSProperties}
                  bodyClassName="p-0 m-0"
                  body={(rowData) => (
                    <p className="p-1 m-0 text-wrap" style={{ minWidth: '500px' }}>
                      {rowData?.observaciones}
                    </p>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </div>

        <Modal
          centered
          show={showModal}
          onHide={() => {
            methods.reset({});
            setId(null);
            setShowModal(false);
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Modal.Header closeButton={!guardando}>
                <Modal.Title>Formulario</Modal.Title>
              </Modal.Header>
              <Modal.Body className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <Controller
                      name="tipo"
                      render={({ field: { value } }) => (
                        <p>
                          Registrando: <strong>{value}</strong>
                        </p>
                      )}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="observaciones">Observaciones</label>
                    <TextArea
                      block
                      controller={{ name: 'observaciones', rules: { required: 'Este campo es obligatorio' } }}
                      rows={10}
                      disabled={guardando}
                    />
                    <ErrorMessage name="observaciones" />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button label="Guardar" icon={PrimeIcons.SAVE} outlined type="submit" loading={guardando} />
              </Modal.Footer>
            </form>
          </FormProvider>
        </Modal>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default DetallePacienteItem;
