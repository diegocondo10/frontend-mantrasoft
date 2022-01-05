import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import NumberInput from '@src/components/Forms/NumberInput';
import RenderField from '@src/components/Forms/RenderField';
import Modal from '@src/components/Modal';
import API from '@src/services/api';
import { urlGetSignoVital, urlRegistrarSignoVital } from '@src/services/urls';
import moment from 'moment';
import Router from 'next/router';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const ModalRespiracion: React.FC<{ paciente: any }> = ({ paciente }) => {
  const [show, setShow] = useState(false);
  const methods = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      formData.tipo = 4;
      formData.hora = moment().format('HH:mm');
      formData.fecha = Router.query.startDate;
      formData.idPaciente = paciente.id;
      await API.private().post(urlRegistrarSignoVital, formData);
      const res = await API.private().get(urlGetSignoVital(Router.query.startDate, paciente.id, 4));
      methods.reset(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onClickShow = async () => {
    try {
      setLoading(true);
      const res = await API.private().get(urlGetSignoVital(Router.query.startDate, paciente.id, 4));
      methods.reset(res.data);
    } catch (error) {
      console.log(error);
    }
    setShow(true);
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Button outlined icon={PrimeIcons.PLUS} onClick={onClickShow} label="Registrar respiración" />
      <Modal
        show={show}
        onHide={() => {
          methods.reset({});
          setShow(false);
        }}
        modal={{ size: 'sm', centered: true }}
        header={{ title: 'Respiración', closeButton: !loading }}
        body={{ className: 'text-center' }}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <label htmlFor="valor" className="w-100">
              Ingrese la respiración
            </label>
            <RenderField
              name="id"
              defaultValue={null}
              render={() => <strong className="text-center text-success w-100">Registrado</strong>}
              renderIfNotValue={() => <strong className="text-center text-danger w-100">Sin Registrar</strong>}
            />
            <div className="w-full my-3">
              <NumberInput
                block
                controller={{ name: 'valor', rules: { required: 'Este campo es obligatorio', min: 0, max: 20 } }}
                min={0}
                max={100}
                autoFocus
                showButtons
                useGrouping={false}
              />
              <ErrorMessage name="valor" />
            </div>
            <Button icon={PrimeIcons.SAVE} type="submit" label="Guardar" block outlined sm loading={loading} />
          </form>
        </FormProvider>
      </Modal>
    </React.Fragment>
  );
};

export default ModalRespiracion;
