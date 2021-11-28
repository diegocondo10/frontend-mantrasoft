/* eslint-disable no-unused-vars */
import Button from '@src/components/Button';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import { PrimeIcons } from 'primereact/api';
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

const Medicamentos: React.FC<MedicamentosProps> = (props) => {
  const methods = useForm({ mode: 'onChange' });
  const onSubmit = async (formData) => {
    console.log(formData);
    methods.reset({});
  };
  return (
    <FormProvider {...methods}>
      <form>
        <div className="col-12 border p-4 my-4">
          <div className="row">
            <div className="col-12 lg:col-4">
              <label htmlFor="">Medicamento</label>
              <DropDown
                controller={{ name: 'medicamento', rules: { required: 'Obligatorio' } }}
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
              <input type="time" name="" id="" />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
              <label htmlFor="cantidad">Cantidad</label>
              <TextInput controller={{ name: 'cantidad', rules: { required: 'Obligatorio' } }} block />
              <ErrorMessage name="cantidad" />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
              <label htmlFor="">Tipo de cantidad</label>
              <DropDown controller={{ name: 'tipoCantidad', rules: { required: 'Obligatorio' } }} options={[]} block />
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
        <div className="col-12"></div>
      </form>
    </FormProvider>
  );
};

export default Medicamentos;
