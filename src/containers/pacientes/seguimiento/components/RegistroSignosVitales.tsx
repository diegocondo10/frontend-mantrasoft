import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import HiddenField from '@src/components/Forms/HiddenField';
import NumberInput from '@src/components/Forms/NumberInput';
import RenderField from '@src/components/Forms/RenderField';
import Loading from '@src/components/Loading';
import { SignosVitalesService } from '@src/services/signosVitales/signosVitales.service';
import { PK } from '@src/types/api';
import { format } from 'date-fns';
import { Tag } from 'primereact/tag';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

const isWithinAllowedTimeRange = (key: string) => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  if (key === 'am') {
    return currentHour < 16;
  } else if (key === 'pm') {
    return currentHour >= 12 || currentHour < 4;
  }
  return false;
};

const getAdjustedDate = (key: string, currentDate: Date): Date => {
  const adjustedDate = new Date(currentDate);

  if (key === 'am' && adjustedDate.getHours() >= 12) {
    adjustedDate.setHours(11, 59, 59, 999);
  } else if (key === 'pm' && adjustedDate.getHours() >= 0 && adjustedDate.getHours() < 4) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    adjustedDate.setHours(23, 59, 59, 999);
    console.log('HORA: ', adjustedDate);
  }

  return adjustedDate;
};

const horarios = [
  {
    key: 'am',
    title: 'Mañana (AM)',
    // disabled: false,
    disabled: !isWithinAllowedTimeRange('am'),
  },
  {
    key: 'pm',
    title: 'Tarde (PM)',
    disabled: !isWithinAllowedTimeRange('pm'),
  },
];

const RegistroSignosVitales: React.FC<{ idFicha: PK; fechaSeleccionada: Date }> = ({ idFicha, fechaSeleccionada }) => {
  const methods = useForm({ mode: 'onChange' });

  const querySignos = useQuery(
    [idFicha, fechaSeleccionada],
    () => new SignosVitalesService().findByDate(fechaSeleccionada.toISOString().split('T')[0], idFicha),
    {
      refetchOnWindowFocus: false,
      onSuccess: ({ data }) => {
        methods.reset(data);
      },
    },
  );
  const [registrando, setRegistrando] = useState(false);
  const onSubmit = (key: string) => async (formData) => {
    setRegistrando(true);
    const currentDate = fechaSeleccionada;

    const adjustedDate: Date = getAdjustedDate(key, currentDate);
    const fecha = format(adjustedDate, 'yyyy-MM-dd');
    const hora = format(adjustedDate, 'HH:mm:ss');

    const response = await new SignosVitalesService().registrar(fecha, hora, idFicha, formData[key]);
    console.log(response);
    await querySignos.refetch();
    setRegistrando(false);
  };

  if (querySignos.isFetching) {
    return <Loading loading />;
  }

  return (
    <FormProvider {...methods}>
      <div className="grid grid-nogutter">
        <form className="col-12 grid grid-nogutter justify-content-around">
          {horarios.map((item, index) => (
            <React.Fragment key={item.key}>
              <div className="col-12 my-4">
                <p className="text-center text-2xl font-bold p-0 m-0">{item.title}</p>
              </div>
              <div className="field col-11 sm:col-4 sm:h-10rem md:col-4 flex-column">
                <div className="field h-full align-content-center w-full">
                  <label
                    className="font-bold text-xl flex flex-row align-items-center"
                    htmlFor={`${item.key}.pulso.value`}
                  >
                    Pulso:
                    <span className="mx-1" />
                    <RenderField
                      name={`${item.key}.pulso.id`}
                      defaultValue={null}
                      render={() => <Tag severity="success" value="Registrado" />}
                      renderIfNotValue={() => <Tag severity="danger" value="No registrado" />}
                    />
                  </label>
                  <HiddenField name={`${item.key}.pulso.tipo`} defaultValue={1} />
                  <HiddenField
                    name={`${item.key}.pulso.uuid`}
                    defaultValue={`${item.key}-${format(fechaSeleccionada, 'yyyy-MM-dd')}-pulso`}
                  />
                  <NumberInput
                    controller={{ name: `${item.key}.pulso.value`, defaultValue: 60 }}
                    min={1}
                    max={300}
                    useGrouping={false}
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-outlined"
                    incrementButtonClassName="p-button-outlined"
                    block
                    inputClassName="text-center font-bold text-xl"
                    disabled={item.disabled || registrando}
                  />
                  <ErrorMessage name={`${item.key}.pulso.value`} />
                </div>
              </div>
              <div className="field col-11 sm:col-4 sm:h-10rem md:col-4 flex-column">
                <div className="field h-full align-content-center">
                  <label
                    className="font-bold text-xl flex flex-row align-items-center"
                    htmlFor={`${item.key}.temperatura.value`}
                  >
                    Temperatura:
                    <span className="mx-1" />
                    <RenderField
                      name={`${item.key}.temperatura.id`}
                      defaultValue={null}
                      render={() => <Tag severity="success" value="Registrado" />}
                      renderIfNotValue={() => <Tag severity="danger" value="No registrado" />}
                    />
                  </label>
                  <HiddenField name={`${item.key}.temperatura.tipo`} defaultValue={2} />
                  <HiddenField
                    name={`${item.key}.temperatura.uuid`}
                    defaultValue={`${item.key}-${format(fechaSeleccionada, 'yyyy-MM-dd')}-temperatura`}
                  />
                  <NumberInput
                    controller={{ name: `${item.key}.temperatura.value`, defaultValue: 30 }}
                    min={1}
                    max={300}
                    useGrouping={false}
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-outlined"
                    incrementButtonClassName="p-button-outlined"
                    block
                    inputClassName="text-center font-bold text-xl"
                    disabled={item.disabled || registrando}
                  />
                  <ErrorMessage name={`${item.key}.temperatura.value`} />
                </div>
              </div>
              <div className="field col-11 sm:col-3 sm:h-10rem md:col-3 flex-column">
                <div className="h-full align-content-center">
                  <div style={{ height: '20.69px' }} />
                  <Button
                    label="Guardar"
                    outlined
                    block
                    className="font-bold text-xl"
                    onClick={methods.handleSubmit(onSubmit(item.key))}
                    disabled={item.disabled}
                    loading={registrando}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </form>
      </div>
    </FormProvider>
  );
};

export default RegistroSignosVitales;
