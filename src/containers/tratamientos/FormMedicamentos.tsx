import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import { REQUIRED_RULE } from '@src/constants/rules';
import { uuidV4 } from '@src/utils/uuid';
import { range } from 'lodash';
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

const FormMedicamentos: React.FC<{ medicamentos: any[]; frecuencias: any[] }> = ({ medicamentos, frecuencias }) => {
  const [visible, setVisible] = useState(false);

  const parentForm = useFormContext();

  const methods = useForm({ mode: 'onChange' });

  const [frecuencia, setFrecuencia] = useState<any>(null);

  const onSubmit = (data) => {
    data.uuid = uuidV4();
    data.medicamento = medicamentos.find((item) => item.value === data.medicamento);
    data.frecuencia = frecuencia?.label;
    const medicamentosForm = parentForm.getValues('medicamentos') || [];
    parentForm.setValue('medicamentos', [...medicamentosForm, data]);
    closeModal();
  };

  const closeModal = () => {
    methods.reset({});
    setFrecuencia(null);
    setVisible(false);
  };

  return (
    <React.Fragment>
      <Button outlined sm label="Agregar" icon={PrimeIcons.PLUS} onClick={() => setVisible(true)} />
      {visible && (
        <Dialog
          draggable={false}
          header="Agregar Medicamento"
          visible={visible}
          style={{ minWidth: '25rem', maxWidth: '40vw' }}
          onHide={closeModal}
          closeOnEscape={false}
        >
          <FormProvider {...methods}>
            <form className="formgrid grid justify-content-center" onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="field col-12">
                <label htmlFor="medicamento">Medicamento:*</label>
                <DropDown
                  options={medicamentos}
                  block
                  filter
                  filterMatchMode="contains"
                  filterPlaceholder="Buscar..."
                  filterInputAutoFocus
                  panelClassName="border border-1 border-gray-400"
                  controller={{
                    name: 'medicamento',
                    rules: {
                      ...REQUIRED_RULE,
                    },
                  }}
                />
                <ErrorMessage name="medicamento" />
              </div>

              <div className="field col-12">
                <label htmlFor="frecuencia">Frecuencia:*</label>
                <DropDown
                  options={frecuencias}
                  block
                  controller={{
                    name: 'frecuencia',
                    rules: {
                      ...REQUIRED_RULE,
                      onChange: (e) => {
                        methods.setValue('horas', null);
                        const value = e?.target?.value;
                        const result = frecuencias?.find((f) => f.value === value);
                        setFrecuencia(result);
                        methods.setValue('horas', []);
                      },
                    },
                  }}
                />
                <ErrorMessage name="frecuencia" />
              </div>

              <div className="field col-12">
                <label htmlFor="motivo">Motivo:*</label>
                <TextArea block id="motivo" controller={{ name: 'motivo', rules: { ...REQUIRED_RULE } }} />
                <ErrorMessage name="motivo" />
              </div>

              <div className="field col-12">
                <label className="w-full" htmlFor="horas">
                  Horas suministro:*
                </label>
                <div className="grid">
                  {range(frecuencia?.cantidadHoras)?.map((hora) => (
                    <div className="col">
                      <TextInput
                        block
                        key={`${frecuencia.label}-${hora}`}
                        type="time"
                        controller={{
                          name: `horas.${hora}`,
                          rules: {
                            ...REQUIRED_RULE,
                          },
                        }}
                      />
                      <ErrorMessage name={`horas.${hora}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="field col-8 my-2">
                <Button label="Guardar" block onClick={methods.handleSubmit(onSubmit)} />
              </div>
            </form>
          </FormProvider>
        </Dialog>
      )}
    </React.Fragment>
  );
};

export default FormMedicamentos;
