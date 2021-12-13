/* eslint-disable no-unused-vars */
import { CSSProperties } from '@emotion/react/node_modules/@emotion/serialize';
import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import { range, uniqueId } from 'lodash';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef, useState } from 'react';
import { FieldError, FormProvider, Noop, RefCallBack, useForm } from 'react-hook-form';
export interface MedicamentosProps {
  medicamentos: any[];
  frecuencias: any[];

  onChange: (...event: any[]) => void;
  onBlur?: Noop;
  value?: any[];
  name?: string;
  ref: RefCallBack;

  invalid: boolean;
  isTouched: boolean;
  isDirty: boolean;
  error?: FieldError;
}
function compare(a, b) {
  if (a.hora > b.hora) {
    return 1;
  }
  if (a.hora < b.hora) {
    return -1;
  }
  return 0;
}
const Medicamentos: React.FC<MedicamentosProps> = (props) => {
  const methods = useForm({ mode: 'onChange' });
  const ref = useRef(null);
  const [frecuencia, setFrecuencia] = useState(null);
  const onSubmit = async (formData) => {
    formData.uuid = uniqueId('UNIQUE_ID');
    methods.setValue('medicamento', null);
    methods.setValue('horas', []);
    methods.setValue('frecuencia', null);

    if (!Array.isArray(props.value)) {
      props.value = [];
    }
    console.log('DATA[]: ', props.value);
    console.log('DATA: ', formData);
    const newValue = { ...formData };
    props.onChange([...props.value, newValue].sort(compare));
  };
  const onSubmitError = (error) => {
    console.log('ERROR: ', error);
  };

  const onClickDelete = (data) => () => {
    props.onChange([...props.value.filter((item) => item.uuid !== data.uuid)]);
  };
  return (
    <FormProvider {...methods}>
      <div className="col-12 border p-4 my-4">
        <div className="row">
          <div className="col-12 lg:col-4">
            <label htmlFor="medicamento">Medicamento</label>
            <DropDown
              controller={{ name: 'medicamento', rules: { required: 'Obligatorio' }, control: methods.control }}
              options={props.medicamentos}
              filter
              filterMatchMode="contains"
              showClear
              showFilterClear
              resetFilterOnHide
              block
            />
            <ErrorMessage name="medicamento" />
          </div>
          <div className="col-12 lg:col-4">
            <div>
              <label htmlFor="frecuencia">Frecuencia</label>
              <span className="p-inputgroup flex-wrap">
                <DropDown
                  controller={{
                    name: 'frecuencia',
                    rules: {
                      required: 'Obligatorio',
                      onChange: (e) => {
                        const value = e?.target?.value;
                        methods.setValue('horas[]', null);
                        if (value) {
                          const result = props.frecuencias?.find((f) => f.value === value);
                          setFrecuencia({ ...result });
                          const horas = result?.horas || [];
                          methods.setValue('horas[]', [...horas]);
                        }
                      },
                    },
                    control: methods.control,
                  }}
                  options={props.frecuencias}
                  filter
                  filterMatchMode="contains"
                  optionLabel="value"
                  showClear
                  showFilterClear
                  resetFilterOnHide
                  style={{ minWidth: '120px' } as CSSProperties}
                />

                {methods.watch('frecuencia') && (
                  <Button
                    icon={PrimeIcons.CLOCK}
                    outlined
                    label="Horas de suministro"
                    onClick={(e) => ref.current.toggle(e)}
                  />
                )}
                <OverlayPanel className="border border-2" ref={ref} style={{ width: '350px' }} showCloseIcon>
                  <h5>Editar las horas de suministración de la medicación</h5>
                  {range(frecuencia?.cantidadHoras)?.map((hora) => (
                    <TextInput type="time" key={hora} controller={{ name: `horas.${hora}` }} />
                  ))}
                </OverlayPanel>
              </span>
              <ErrorMessage name="frecuencia" />
            </div>
          </div>
          <div className="col-12 lg:col-2">
            <Button
              block
              icon={PrimeIcons.PLUS}
              label="Agregar"
              outlined
              style={{ marginTop: '25.33px' }}
              type="button"
              onClick={methods.handleSubmit(onSubmit, onSubmitError)}
            />
          </div>
        </div>
      </div>
      <div className="col-12">
        <DataTable value={props.value} autoLayout responsiveLayout="scroll">
          {ColumnaNo({ width: '80px' })}
          <Column header="Medicamento" field="medicamento.label" />
          <Column header="Frecuencia" field="frecuencia" style={{ width: '80px' }} className="text-center" />
          <Column
            header="Horas"
            field="horas"
            style={{ width: '80px' }}
            className="text-center"
            body={(rowData) =>
              rowData?.horas?.map((hora) => (
                <div className="d-flex flex-column" key={`${rowData.uuid}-${hora}`}>
                  <strong>{hora}</strong>
                </div>
              ))
            }
          />
          <Column
            header={<i className={PrimeIcons.TRASH} />}
            className="p-0 m-0 text-center"
            style={{ width: '50px' }}
            body={(rowData) => (
              <Button icon={PrimeIcons.TRASH} sm outlined variant="danger" onClick={onClickDelete(rowData)} />
            )}
          />
        </DataTable>
      </div>
    </FormProvider>
  );
};

export default Medicamentos;
