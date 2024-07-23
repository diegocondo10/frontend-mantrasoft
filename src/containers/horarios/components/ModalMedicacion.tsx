import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import Modal from '@src/components/Modal';
import API from '@src/services/api';
import { urlRegistrarMedicacion } from '@src/services/urls';
import moment from 'moment';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import { ESTADO_MEDICACION } from '../constants';
import HeaderMedicamentoModal from './HeaderMedicamentoModal';
import HoraMedicacion from './HoraMedicacion';

const ModalMedicacion = ({ medicacion, loadingMedicamentos, paciente }) => {
  const [show, setShow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const methods = useForm({ mode: 'onChange' });
  const queryClient = useQueryClient();
  const isLoading = queryClient.isFetching(['medicamentos', medicacion?.ids]) === 1;
  const usuarios = queryClient.getQueryData<{ data: any[] }>(['personal-autorizado-medicacion'])?.data || [];
  const medicamentos = queryClient.getQueryData<{ data: any[] }>(['medicamentos-label-value'])?.data || [];

  const onClickAgregar = () => {
    setShowForm(true);
    console.log(moment().format('hh:mm'));
    methods.reset({
      hora: moment().format('hh:mm'),
    });
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    await API.private().post(urlRegistrarMedicacion(paciente?.id), {
      medicamentoId: formData?.medicamento?.value,
      hora: formData?.hora,
      fecha: paciente.fecha,
      observacion: formData?.observacion,
      autorizadoPor: formData?.autorizadoPor?.value,
      tipo: ESTADO_MEDICACION.RAZONES_NECESARIAS,
    });
    await queryClient.refetchQueries(['medicamentos', medicacion?.ids]);
    setLoading(false);
    setShowForm(false);
  };

  return (
    <React.Fragment>
      <Button
        label="Medicamentos"
        icon={PrimeIcons.INFO}
        onClick={() => setShow(true)}
        loading={loadingMedicamentos}
        outlined
        variant="info"
      />
      <Modal
        modal={{ scrollable: true, size: 'xl', centered: true }}
        show={show}
        onHide={() => setShow(false)}
        header={{ closeButton: !isLoading, title: 'Medicación' }}
      >
        {!showForm && (
          <Button
            label="Agregar nuevo Medicamento"
            sm
            outlined
            variant="info"
            icon={PrimeIcons.PLUS}
            onClick={onClickAgregar}
          />
        )}
        {showForm && (
          <React.Fragment>
            <Button
              label="Cancelar"
              sm
              outlined
              variant="danger"
              icon={PrimeIcons.TIMES}
              onClick={() => setShowForm(false)}
              loading={loading}
            />
            <FormProvider {...methods}>
              <form className="mb-5" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="w-full">
                  <label htmlFor="autorizadoPor">Autorizado por:*</label>
                  <Controller
                    name="autorizadoPor"
                    rules={{
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio',
                      },
                    }}
                    render={({ field: { value, name, onChange, ref }, fieldState: { invalid } }) => (
                      <Select
                        options={usuarios}
                        name={name}
                        id={name}
                        onChange={onChange}
                        isClearable
                        ref={ref}
                        value={value}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            [invalid ? 'borderColor' : undefined]: '#f0a9a7',
                          }),
                        }}
                      />
                    )}
                  />
                  <ErrorMessage name="autorizadoPor" />
                </div>
                <div className="w-full">
                  <label htmlFor="medicamento">Medicamento:*</label>
                  <Controller
                    name="medicamento"
                    rules={{
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio',
                      },
                    }}
                    render={({ field: { value, name, onChange, ref }, fieldState: { invalid } }) => (
                      <Select
                        options={medicamentos}
                        name={name}
                        id={name}
                        onChange={onChange}
                        isClearable
                        ref={ref}
                        value={value}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            [invalid ? 'borderColor' : undefined]: '#f0a9a7',
                          }),
                        }}
                      />
                    )}
                  />
                  <ErrorMessage name="medicamento" />
                </div>
                <div className="w-full">
                  <label htmlFor="hora" className="w-full">
                    Hora: *
                  </label>
                  <TextInput
                    block
                    controller={{ name: 'hora', rules: { required: 'Este campo es obligatorio' } }}
                    type="time"
                  />
                  <ErrorMessage name="hora" />
                </div>
                <div className="w-full">
                  <label htmlFor="observacion">Motivo:</label>

                  <TextArea
                    block
                    controller={{ name: 'observacion', rules: { required: 'Este campo es obligatorio' } }}
                  />
                  <ErrorMessage name="observacion" />
                </div>
                <div className="w-full text-end">
                  <Button variant="info" label="Guardar" type="submit" outlined sm loading={loading} />
                </div>
              </form>
            </FormProvider>
          </React.Fragment>
        )}

        {medicacion?.medicamentos?.map?.((medicamento, index) => (
          <React.Fragment key={medicamento?.id}>
            <HeaderMedicamentoModal
              medicamento={medicamento}
              index={index}
              paciente={paciente}
              medicacion={medicacion}
            />
            <div>
              {medicamento?.horas?.map((hora) => (
                <HoraMedicacion
                  key={hora?.horaStr}
                  {...hora}
                  isLoading={isLoading}
                  medicacion={medicacion}
                  paciente={paciente}
                  medicamento={medicamento}
                />
              ))}
            </div>
            <hr />
          </React.Fragment>
        ))}
      </Modal>
    </React.Fragment>
  );
};

export default ModalMedicacion;
