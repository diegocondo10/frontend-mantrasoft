import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import Modal from '@src/components/Modal';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import HeaderMedicamentoModal from './HeaderMedicamentoModal';
import HoraMedicacion from './HoraMedicacion';

const ModalMedicacion = ({ medicacion, loadingMedicamentos, paciente }) => {
  const [show, setShow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const methods = useForm({ mode: 'onChange' });
  const queryClient = useQueryClient();
  const isLoading = queryClient.isFetching(['medicamentos', medicacion?.ids]) === 1;
  const usuarios = queryClient.getQueryData<{ data: any[] }>(['personal-autorizado-medicacion'])?.data;
  const onClickAgregar = () => {
    setShowForm(true);
  };

  const onSubmit = async (formData) => {
    console.log(formData);
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
                  <label htmlFor="observacion">Motivo:</label>

                  <TextArea
                    block
                    controller={{ name: 'observacion', rules: { required: 'Este campo es obligatorio' } }}
                  />
                  <ErrorMessage name="observacion" />
                </div>
                <div className="w-full text-end">
                  <Button variant="info" label="Guardar" type="submit" outlined sm />
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
