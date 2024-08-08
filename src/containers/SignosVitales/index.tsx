import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import NumberInput from '@src/components/Forms/NumberInput';
import TimePicker from '@src/components/Forms/TimePicker';
import { getMinMaxTimesAmPm, isAm } from '@src/utils/date';
import { PrimeIcons } from 'primereact/api';
import { FormProvider, useForm } from 'react-hook-form';

const AM = getMinMaxTimesAmPm();
const PM = getMinMaxTimesAmPm(false);

const SignosVitales = () => {
  const methods = useForm({ mode: 'onChange' });

  return (
    <FormProvider {...methods}>
      <div className="grid ">
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="PM-2.hora">Hora</label>
          <span className="p-inputgroup">
            <TimePicker
              controller={{
                name: 'PM-2.hora',
              }}
              datePicker={{
                timeIntervals: 1,
                placeholderText: 'SELECCIONE...',
                calendarClassName: 'hide-disabled-times',
                ...(isAm() ? AM : PM),
              }}
              block
            />
          </span>
          <ErrorMessage name="PM-2.hora" />
        </div>
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="">Temperatura</label>
          <NumberInput
            controller={{
              name: 'temperatura',
              defaultValue: 30,
            }}
            block
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            useGrouping={false}
            min={1}
          />
        </div>
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 align-items-baseline">
          <label htmlFor=""></label>
          <Button className="mt-4" label="Guardar" outlined icon={PrimeIcons.SAVE} />
        </div>
        {/* <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="">Tensión arterial</label>
          <NumberInput
            controller={{
              name: 'tensionArterial',
              defaultValue: 1,
            }}
            block
            
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            useGrouping={false}
            min={1}
          />
        </div>
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="respiracion">Respiración</label>
          <NumberInput
            controller={{
              name: 'respiracion',
              defaultValue: 1,
            }}
            block
            
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            useGrouping={false}
            min={1}
          />
        </div>
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="respiracion">Deposiciones</label>
          <NumberInput
            controller={{
              name: 'deposiciones',
              defaultValue: 1,
            }}
            block
            
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            useGrouping={false}
            min={1}
          />
        </div>
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="respiracion">Comidas</label>
          <NumberInput
            controller={{
              name: 'comidas',
              defaultValue: 1,
            }}
            block
            
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            useGrouping={false}
            min={1}
          />
        </div>
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="respiracion">Peso (Kg)</label>
          <NumberInput
            controller={{
              name: 'peso',
              defaultValue: 1,
            }}
            block
            
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            useGrouping={false}
            min={1}
          />
        </div>
        <div className="field col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3">
          <label htmlFor="respiracion">Aseo</label>
          <NumberInput
            controller={{
              name: 'aseo',
              defaultValue: 1,
            }}
            block
            
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            useGrouping={false}
            min={1}
          />
        </div> */}
      </div>
    </FormProvider>
  );
};

export default SignosVitales;
