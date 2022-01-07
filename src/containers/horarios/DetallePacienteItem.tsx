import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import RenderField from '@src/components/Forms/RenderField';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import Modal from '@src/components/Modal';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import API from '@src/services/api';
import {
  urlCreateSeguimientoEnfermeria,
  urlDeleteSeguimientoEnfermeria,
  urlGetSignos,
  urlRegistrarSignoVital,
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
import { Accordion } from 'react-bootstrap';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import ModalSigno from './components/ModalSigno';

const TIME_FORMAT = 'HH:mm';
const AM_VALIDATION = (value) => {
  const momentValue = moment(value, TIME_FORMAT);
  if (
    momentValue.isSameOrAfter(moment('00:00', TIME_FORMAT)) &&
    momentValue.isSameOrBefore(moment('11:59', TIME_FORMAT))
  ) {
    return true;
  }

  return 'Ingrese una hora entre 00:00 y 11:59';
};
const PM_VALIDATION = (value) => {
  const momentValue = moment(value, TIME_FORMAT);
  if (
    momentValue.isSameOrAfter(moment('12:00', TIME_FORMAT)) &&
    momentValue.isSameOrBefore(moment('23:59', TIME_FORMAT))
  ) {
    return true;
  }

  return 'Ingrese una hora entre 12:00 y 23:59';
};

const DetallePacienteItem = ({ paciente, index }) => {
  const { usuario } = useUsuario();
  const [data, setData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [id, setId] = useState(null);
  const methods = useForm({ mode: 'onChange' });

  const [loadingAm1, setLoadingAm1] = useState(false);
  const [loadingAm2, setLoadingAm2] = useState(false);
  const [loadingPm1, setLoadingPm1] = useState(false);
  const [loadingPm2, setLoadingPm2] = useState(false);

  const loading = {
    'AM-1': loadingAm1,
    'AM-2': loadingAm2,
    'PM-1': loadingPm1,
    'PM-2': loadingPm2,
  };

  const setLoading = {
    'AM-1': setLoadingAm1,
    'AM-2': setLoadingAm2,
    'PM-1': setLoadingPm1,
    'PM-2': setLoadingPm2,
  };

  const methodsSignoVitales = {
    'AM-1': useForm({ mode: 'onChange' }),
    'AM-2': useForm({ mode: 'onChange' }),
    'PM-1': useForm({ mode: 'onChange' }),
    'PM-2': useForm({ mode: 'onChange' }),
  };

  const [showModalSignos, setShowModalSignos] = useState(false);

  const query = useQuery(
    ['seguimientos-paciente', paciente.id, paciente.idHorario],
    () => API.private().get(urlSeguimientosPacienteHorarios(paciente.fecha, paciente.id)),
    {
      enabled: false,
      onSuccess: (res) => {
        setData(res?.data?.seguimientos);
      },
    },
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
    } catch (error) {
      console.log(error);
    }
    query.refetch();
    setShowModal(false);
    setId(null);
    methods.reset({});
    setGuardando(false);
  };

  const onSubmitSigno = (tipo: 'AM-1' | 'PM-1' | 'AM-2' | 'PM-2') => async (formData) => {
    try {
      setLoading[tipo](true);
      const body = {
        fecha: paciente.fecha,
        tipo: +tipo.split('-')[1],
        idPaciente: paciente.id,
        ...formData[tipo],
      };
      await API.private().post(urlRegistrarSignoVital, body);
      const res = await API.private().get(urlGetSignos(paciente.fecha, paciente.id));
      Object.entries(res?.data).forEach(([key, value]) => {
        methodsSignoVitales[key].reset({ [key]: value } || {});
      });
    } catch (error) {
      alert('HA OCURRIDO UN PROBLEMA AL GUARDAR LA INFORMACIÓN');
    }
    setLoading[tipo](false);
  };

  const header = (
    <div className="d-flex flex-row justify-content-between flex-wrap">
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

      <ModalSigno
        modalTitle="Tensión arterial"
        title="Ingrese la tensión arterial"
        buttonLabel="Tensión arterial"
        paciente={paciente}
        tipo={3}
      />
      <ModalSigno
        modalTitle="Respiración"
        title="Ingrese la respiración"
        buttonLabel="Respiración"
        paciente={paciente}
        tipo={4}
      />
      <ModalSigno
        modalTitle="Número de deposiciones"
        title="Ingrese el número"
        buttonLabel="Número de deposiciones"
        paciente={paciente}
        tipo={5}
      />
      <ModalSigno
        modalTitle="Número de comidas"
        title="Ingrese el número"
        buttonLabel="Número de comidas"
        paciente={paciente}
        tipo={6}
      />
      <ModalSigno
        modalTitle="Peso"
        title="Registrar el peso en (Kg)"
        buttonLabel="Peso"
        paciente={paciente}
        tipo={7}
        max={300}
      />
      <ModalSigno modalTitle="Aseo" title="Aseo" buttonLabel="Aseo" paciente={paciente} tipo={8} max={20} />
      <ModalSigno modalTitle="Baño" title="Baño" buttonLabel="Baño" paciente={paciente} tipo={9} max={20} />
      <Button
        icon={PrimeIcons.PLUS}
        label="Pulso/Temperatura"
        sm
        outlined
        onClick={async () => {
          setShowModalSignos(true);
          const res = await API.private().get(urlGetSignos(paciente.fecha, paciente.id));
          Object.entries(res?.data).forEach(([key, value]) => {
            methodsSignoVitales[key].reset({ [key]: value } || {});
          });
        }}
      />
    </div>
  );
  return (
    <Accordion.Item eventKey={`${index}-${paciente.id}-${paciente.idHorario}`}>
      <Accordion.Header
        onClick={() => {
          query.refetch();
        }}
      >
        {paciente?.str}
      </Accordion.Header>
      <Accordion.Body className="p-0 m-0">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 py-0">
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
                responsiveLayout="scroll"
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
                          } catch (error) {
                            console.log(error);
                          }
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
          show={showModal}
          onHide={() => {
            methods.reset({});
            setId(null);
            setShowModal(false);
          }}
          modal={{
            centered: true,
            size: 'sm',
          }}
          header={{
            closeButton: !guardando,
            title: 'Formulario',
          }}
          body={{ className: 'container-fluid' }}
        >
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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

              <Button label="Guardar" icon={PrimeIcons.SAVE} outlined type="submit" loading={guardando} />
            </form>
          </FormProvider>
        </Modal>

        <Modal
          show={showModalSignos}
          onHide={() => {
            methodsSignoVitales['AM-1'].reset({});
            methodsSignoVitales['AM-2'].reset({});
            methodsSignoVitales['PM-1'].reset({});
            methodsSignoVitales['PM-2'].reset({});
            setShowModalSignos(false);
          }}
          header={{ closeButton: true, title: 'Registro de signos vitales' }}
        >
          <h3 className="text-center">Mañana(AM)</h3>
          <FormProvider {...methodsSignoVitales['AM-1']}>
            <div className="row">
              <RenderField
                name="AM-1.id"
                defaultValue={null}
                render={() => <strong className="text-center text-success">Registrado</strong>}
              />
              <div className="col-4">
                <label htmlFor="AM-1.hora">Hora</label>
                <span className="p-inputgroup">
                  <TextInput
                    controller={{
                      name: 'AM-1.hora',
                      defaultValue: moment().format('HH:mm'),
                      rules: { validate: AM_VALIDATION },
                    }}
                    type="time"
                    block
                  />
                </span>
                <ErrorMessage name="AM-1.hora" />
              </div>
              <div className="col-4">
                <label htmlFor="AM-1.valor">Pulso</label>
                <TextInput
                  controller={{ name: 'AM-1.valor', defaultValue: 50 }}
                  type="number"
                  block
                  keyfilter="int"
                  min={0}
                  max={200}
                />
              </div>
              <div className="col-4">
                <Button
                  icon={PrimeIcons.SAVE}
                  outlined
                  className="mt-label"
                  label="Guardar"
                  block
                  type="button"
                  loading={loading['AM-1']}
                  onClick={methodsSignoVitales['AM-1'].handleSubmit(onSubmitSigno('AM-1'))}
                />
              </div>
            </div>
          </FormProvider>
          <FormProvider {...methodsSignoVitales['AM-2']}>
            <div className="row">
              <RenderField
                name="AM-2.id"
                defaultValue={null}
                render={() => <strong className="text-center text-success">Registrado</strong>}
              />
              <div className="col-4">
                <label htmlFor="AM-2.hora">Hora</label>
                <span className="p-inputgroup">
                  <TextInput
                    controller={{
                      name: 'AM-2.hora',
                      defaultValue: moment().format('HH:mm'),
                      rules: { validate: AM_VALIDATION },
                    }}
                    type="time"
                    block
                  />
                </span>
                <ErrorMessage name="AM-2.hora" />
              </div>
              <div className="col-4">
                <label htmlFor="AM-2.valor">Temperatura</label>
                <TextInput
                  controller={{ name: 'AM-2.valor', defaultValue: 30 }}
                  type="number"
                  block
                  keyfilter="int"
                  min={0}
                  max={80}
                />
              </div>
              <div className="col-4">
                <Button
                  icon={PrimeIcons.SAVE}
                  outlined
                  className="mt-label"
                  label="Guardar"
                  block
                  type="button"
                  loading={loading['AM-2']}
                  onClick={methodsSignoVitales['AM-2'].handleSubmit(onSubmitSigno('AM-2'))}
                />
              </div>
            </div>
          </FormProvider>
          <hr />
          <h3 className="text-center">Tarde(PM)</h3>
          <FormProvider {...methodsSignoVitales['PM-1']}>
            <div className="row">
              <RenderField
                name="PM-1.id"
                defaultValue={null}
                render={() => <strong className="text-center text-success">Registrado</strong>}
              />
              <div className="col-4">
                <label htmlFor="PM-1.hora">Hora</label>
                <span className="p-inputgroup">
                  <TextInput
                    controller={{
                      name: 'PM-1.hora',
                      defaultValue: moment().format('HH:mm'),
                      rules: { validate: PM_VALIDATION },
                    }}
                    type="time"
                    block
                  />
                </span>
                <ErrorMessage name="PM-1.hora" />
              </div>
              <div className="col-4">
                <label htmlFor="PM-1.valor">Pulso</label>
                <TextInput
                  controller={{ name: 'PM-1.valor', defaultValue: 50 }}
                  type="number"
                  block
                  keyfilter="int"
                  min={0}
                  max={200}
                />
              </div>
              <div className="col-4">
                <Button
                  icon={PrimeIcons.SAVE}
                  outlined
                  className="mt-label"
                  label="Guardar"
                  block
                  type="button"
                  loading={loading['PM-1']}
                  onClick={methodsSignoVitales['PM-1'].handleSubmit(onSubmitSigno('PM-1'))}
                />
              </div>
            </div>
          </FormProvider>
          <FormProvider {...methodsSignoVitales['PM-2']}>
            <div className="row">
              <RenderField
                name="PM-2.id"
                defaultValue={null}
                render={() => <strong className="text-center text-success">Registrado</strong>}
              />
              <div className="col-4">
                <label htmlFor="PM-2.hora">Hora</label>
                <span className="p-inputgroup">
                  <TextInput
                    controller={{
                      name: 'PM-2.hora',
                      defaultValue: moment().format('HH:mm'),
                      rules: { validate: PM_VALIDATION },
                    }}
                    type="time"
                    block
                  />
                </span>
                <ErrorMessage name="PM-2.hora" />
              </div>
              <div className="col-4">
                <label htmlFor="PM-2.valor">Temperatura</label>
                <TextInput
                  controller={{ name: 'PM-2.valor', defaultValue: 30 }}
                  type="number"
                  block
                  keyfilter="pint"
                  min={0}
                  max={80}
                />
              </div>
              <div className="col-4">
                <Button
                  icon={PrimeIcons.SAVE}
                  outlined
                  className="mt-label"
                  label="Guardar"
                  block
                  type="button"
                  loading={loading['PM-2']}
                  onClick={methodsSignoVitales['PM-2'].handleSubmit(onSubmitSigno('PM-2'))}
                />
              </div>
            </div>
          </FormProvider>
        </Modal>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default DetallePacienteItem;
