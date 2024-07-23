import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import NumberInput from '@src/components/Forms/NumberInput';
import RenderField from '@src/components/Forms/RenderField';
import Modal from '@src/components/Modal';
import API from '@src/services/api';
import { urlGetSignoVital, urlRegistrarSignoVital } from '@src/services/urls';
import moment from 'moment';
import { PrimeIcons } from 'primereact/api';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type ModalSignoType = {
  paciente: any;
  tipo: number;
  title: string;
  modalTitle: string;
  buttonLabel: string;
  min?: number;
  max?: number;
};

const ModalSigno: React.FC<ModalSignoType> = (props) => {
  const { paciente, tipo, title, modalTitle, buttonLabel, min, max } = props;
  const date = paciente?.fecha;
  const [show, setShow] = useState(false);
  const methods = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      formData.tipo = tipo;
      formData.hora = moment().format('HH:mm');
      formData.fecha = date;
      formData.idPaciente = paciente.id;
      await API.private().post(urlRegistrarSignoVital, formData);
      const res = await API.private().get(urlGetSignoVital(date, paciente.id, tipo));
      methods.reset(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onClickShow = async () => {
    try {
      setLoading(true);
      const res = await API.private().get(urlGetSignoVital(date, paciente.id, tipo));
      methods.reset(res.data);
    } catch (error) {
      console.log(error);
    }
    setShow(true);
    setLoading(false);
  };
  const minValue = min ? min : 0;
  const maxValue = max ? max : 20;

  return (
    <React.Fragment>
      <Button outlined sm icon={PrimeIcons.PLUS} onClick={onClickShow} label={buttonLabel} />
      <Modal
        show={show}
        onHide={() => {
          methods.reset({});
          setShow(false);
        }}
        modal={{ size: 'sm', centered: true }}
        header={{ title: modalTitle ? modalTitle : 'Signo Vital', closeButton: !loading }}
        body={{ className: 'text-center' }}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <label htmlFor="valor" className="w-full">
              {title}
            </label>
            <RenderField
              name="id"
              defaultValue={null}
              render={() => <strong className="text-center text-success w-full">Registrado</strong>}
              renderIfNotValue={() => <strong className="text-center text-danger w-full">Sin Registrar</strong>}
            />
            <div className="w-full my-3">
              <NumberInput
                block
                controller={{
                  name: 'valor',
                  rules: {
                    required: 'Este campo es obligatorio',
                    min: {
                      value: minValue,
                      message: `El valor mínimo es ${minValue}`,
                    },
                    max: {
                      value: maxValue,
                      message: `El valor máximo es ${maxValue}`,
                    },
                  },
                }}
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

export default ModalSigno;
