/* eslint-disable no-unused-vars */
import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import { uniqueId } from 'lodash';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import { FieldError, FormProvider, Noop, RefCallBack, useForm } from 'react-hook-form';

export interface MedicamentosProps {
  medicamentos: any[];

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
  const onSubmit = async (formData) => {
    formData.uuid = uniqueId('UNIQUE_ID');
    methods.setValue('medicamento', null);
    methods.setValue('hora', '');
    methods.setValue('cantidad', 1);
    methods.setValue('tipoCantidad', null);
    if (!Array.isArray(props.value)) {
      props.value = [];
    }
    props.onChange([...props.value, formData].sort(compare));
  };

  const onClickDelete = (data) => () => {
    props.onChange([...props.value.filter((item) => item.uuid !== data.uuid)]);
  };

  return (
    <FormProvider {...methods}>
      <form>
        <div className="col-12 border p-4 my-4">
          <div className="row">
            <div className="col-12 lg:col-4">
              <label htmlFor="">Medicamento</label>
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
            <div className="col-12 lg:col-2">
              <label htmlFor="hora">Hora:</label>
              {/* <input type="time" name="" id="" /> */}
              <TextInput
                controller={{ name: 'hora', rules: { required: 'Obligatorio' }, control: methods.control }}
                type="time"
                block
              />
              <ErrorMessage name="hora" />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
              <label htmlFor="cantidad">Cantidad</label>
              <TextInput
                controller={{
                  name: 'cantidad',
                  rules: { required: 'Obligatorio' },
                  control: methods.control,
                  defaultValue: 1,
                }}
                block
                type="number"
                min={1}
                max={100}
              />
              <ErrorMessage name="cantidad" />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
              <label htmlFor="">Tipo de cantidad</label>
              <DropDown
                controller={{ name: 'tipoCantidad', rules: { required: 'Obligatorio' }, control: methods.control }}
                options={['Tableta', 'Gota']}
                block
              />
              <ErrorMessage name="tipoCantidad" />
            </div>
            <div className="col-12 lg:col-2">
              <Button
                block
                icon={PrimeIcons.PLUS}
                label="Agregar"
                outlined
                style={{ marginTop: '25.33px' }}
                onClick={methods.handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
        <div className="col-12">
          <DataTable value={props.value} autoLayout>
            {ColumnaNo({ width: '80px' })}
            <Column header="Medicamento" field="medicamento.label" />
            <Column header="Hora" field="hora" style={{ width: '80px' }} className="text-center" />
            <Column header="Cantidad" field="cantidad" style={{ width: '80px' }} className="text-center" />
            <Column header="Tipo de cantidad" field="tipoCantidad" style={{ width: '150px' }} className="text-center" />
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
      </form>
    </FormProvider>
  );
};

export default Medicamentos;
