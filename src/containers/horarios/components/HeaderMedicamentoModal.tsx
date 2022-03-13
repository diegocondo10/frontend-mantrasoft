import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import API from '@src/services/api';
import { urlRegistrarMedicacion } from '@src/services/urls';
import classNames from 'classnames';
import moment from 'moment';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import { ESTADO_MEDICACION } from '../constants';

const HeaderMedicamentoModal = ({ medicamento, index, paciente, medicacion }) => {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const usuarios = queryClient.getQueryData<{ data: any[] }>(['personal-autorizado-medicacion'])?.data;
  const methods = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    await API.private().post(urlRegistrarMedicacion(paciente?.id), {
      medicamentoId: medicamento?.medicamento?.id,
      hora: formData.hora,
      fecha: paciente.fecha,
      observacion: formData?.observacion,
      autorizadoPor: formData?.autorizadoPor?.value,
      tipo: ESTADO_MEDICACION.DIFERENTE_DOSIS,
    });
    await queryClient.refetchQueries(['medicamentos', medicacion?.ids]);
    setLoading(false);
    setShowForm(false);
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-row align-items-center">
        <h4
          className={classNames('my-0 me-3', {
            'text-danger': medicamento?.isAtraso,
            'text-info': medicamento?.isProximo,
          })}
        >
          {index + 1}. {medicamento?.medicamento?.label} {medicamento?.isAtraso && '(Atrasado)'}{' '}
          {medicamento?.isProximo && '(Proximo)'}
        </h4>
        {!medicamento.isNuevo && (
          <Button
            icon={showForm ? PrimeIcons.TIMES : PrimeIcons.PLUS}
            label={showForm ? 'Cancelar' : 'Agregar dosis'}
            sm
            outlined
            variant={showForm ? 'danger' : 'info'}
            onClick={() => {
              methods.reset({
                hora: moment().format('hh:mm'),
              });
              setShowForm(!showForm);
            }}
            loading={loading}
          />
        )}
      </div>
      {showForm && (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <label htmlFor="autorizadoPor" className="w-100">
              Autorizado por:
            </label>

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
                  options={usuarios || []}
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

            <label htmlFor="hora" className="w-100">
              Hora: *
            </label>
            <TextInput
              block
              controller={{ name: 'hora', rules: { required: 'Este campo es obligatorio' } }}
              type="time"
            />
            <ErrorMessage name="hora" />

            <label htmlFor="observacion" className="w-100">
              Motivo:
            </label>

            <TextArea block controller={{ name: 'observacion', rules: { required: 'Este campo es obligatorio' } }} />
            <ErrorMessage name="observacion" />

            <div className="w-full text-right mt-3">
              <span className="p-buttonset">
                <Button label="Guardar" type="submit" sm variant="info" outlined loading={loading} />
              </span>
            </div>
          </form>
        </FormProvider>
      )}
    </React.Fragment>
  );
};

export default HeaderMedicamentoModal;
