import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import API from '@src/services/api';
import { urlRegistrarMedicacion } from '@src/services/urls';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import { ESTADOS_MEDICACION_COLORES, ESTADOS_MEDICACION_LABELS, ESTADO_MEDICACION } from '../constants';

const HoraMedicacion = (props) => {
  const [estado, setEstado] = useState<number | null>(null);
  const methods = useForm({ mode: 'onChange' });
  const { medicacion, paciente, medicamento } = props;
  const queryClient = useQueryClient();

  const usuarios = queryClient.getQueryData<{ data: any[] }>(['personal-autorizado-medicacion'])?.data;
  const [loading, setLoading] = useState(false);

  const [showEstados, setShowEstados] = useState(false);

  useEffect(() => {
    if ([null, ESTADO_MEDICACION.SUMINISTRADO, ESTADO_MEDICACION.NO_HAY].includes(estado)) {
      methods.reset({});
    }
  }, [estado, methods]);

  useEffect(() => {
    setShowEstados(!props?.id);
  }, [props?.id]);

  const onClick = (estadoSeleccionado: number) => () => {
    setEstado(estadoSeleccionado);
    if (ESTADO_MEDICACION.SUMINISTRADO === estadoSeleccionado) {
      onSubmit({ tipo: estadoSeleccionado });
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    await API.private().post(urlRegistrarMedicacion(paciente?.id), {
      medicamentoId: medicamento?.medicamento?.id,
      hora: props?.horaStr,
      fecha: paciente.fecha,
      observacion: formData?.observacion,
      autorizadoPor: formData?.autorizadoPor?.value,
      tipo: formData?.tipo || estado,
    });
    await queryClient.refetchQueries(['medicamentos', medicacion?.ids]);
    setLoading(false);
    setEstado(null);
    setShowEstados(false);
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-row align-items-center my-3">
        <h4 className={classNames('mx-4 p-0 my-0')}>{props?.horaStr}</h4>
        {showEstados && (
          <div className="d-flex flex-row justify-content-evenly flex-wrap">
            <Button outlined sm onClick={onClick(ESTADO_MEDICACION.SUMINISTRADO)} loading={loading}>
              Suministrado
            </Button>

            <Button outlined sm onClick={onClick(ESTADO_MEDICACION.NO_SE_ADMINISTRA)} loading={loading}>
              No se administra
            </Button>

            <Button outlined sm onClick={onClick(ESTADO_MEDICACION.NO_HAY)} loading={loading}>
              No hay medicacón
            </Button>

            <Button outlined sm onClick={onClick(ESTADO_MEDICACION.DIFERENTE_HORA)} loading={loading}>
              Diferente hora
            </Button>

            <Button outlined sm onClick={onClick(ESTADO_MEDICACION.SUSPENDIDA)} loading={loading}>
              Se suspende la medicación
            </Button>
          </div>
        )}

        {!showEstados && (
          <React.Fragment>
            <h4 className="me-3 my-0" style={{ ...ESTADOS_MEDICACION_COLORES[props.tipo] }}>
              {ESTADOS_MEDICACION_LABELS[props.tipo]}
            </h4>
            {!props.isNuevo && ![ESTADO_MEDICACION.DIFERENTE_DOSIS].includes(props.tipo) && (
              <Button outlined label="Cambiar estado" sm onClick={() => setShowEstados(true)} loading={loading} />
            )}
          </React.Fragment>
        )}

        {props?.id && showEstados && !props.isNuevo && (
          <Button
            label="Cancelar cambio"
            sm
            outlined
            variant="danger"
            onClick={() => {
              setEstado(null);
              setShowEstados(false);
            }}
            loading={loading}
          />
        )}
      </div>
      {[ESTADO_MEDICACION.NO_SE_ADMINISTRA, ESTADO_MEDICACION.SUSPENDIDA, ESTADO_MEDICACION.DIFERENTE_HORA].includes(
        estado,
      ) && (
        <div className="ms-5">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <label htmlFor="observacion">Motivo:</label>

              <TextArea block controller={{ name: 'observacion', rules: { required: 'Este campo es obligatorio' } }} />
              <ErrorMessage name="observacion" />

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

              <div className="w-full text-right mt-3">
                <span className="p-buttonset">
                  <Button
                    label="Cancelar"
                    sm
                    variant="danger"
                    outlined
                    onClick={() => setEstado(null)}
                    loading={loading}
                  />
                  <Button label="Guardar" type="submit" sm variant="info" outlined loading={loading} />
                </span>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </React.Fragment>
  );
};

export default HoraMedicacion;
