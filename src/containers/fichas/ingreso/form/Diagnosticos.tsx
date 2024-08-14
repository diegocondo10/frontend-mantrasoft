import Button from '@src/components/Button';
import CheckOptionsMultipleInline from '@src/components/Forms/CheckOptionsMultipleInline';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import { REQUIRED_RULE } from '@src/constants/rules';
import { uuidV4 } from '@src/utils/uuid';
import { PrimeIcons } from 'primereact/api';

import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

const Diagnosticos = () => {
  const { control, setValue, getValues } = useFormContext();
  const options = useMemo(() => ['CLINICO', 'SINDROMICO', 'PSICOLOGICO', 'FUNCIONAL', 'NUTRICIONAL'], []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contenido.diagnosticos.items',
  });

  const onClickAgregar = () => {
    append({
      uuid: uuidV4(),
      diagnostico: '',
      p: true,
      d: false,
      cie: '',
      opcion: options[0],
    });
  };

  const onClickEliminar = (uuid) => () => {
    const items = getValues('contenido.diagnosticos.items');
    const index = items.findIndex((item) => item.uuid === uuid);
    remove(index);
  };

  return (
    <div className="col-11 md:col-11 xl:col-9 border-1 border-gray-200 px-4 pb-4 m-3">
      <div className="flex flex-column m-3">
        <h3>8. DIAGNOSTICOS</h3>
        <div className="my-5">
          <DataTable
            value={fields}
            showGridlines
            size="small"
            header={
              <div>
                <Button label="Agregar" outlined icon={PrimeIcons.PLUS} onClick={onClickAgregar} />
              </div>
            }
            emptyMessage="No se ha agregado valores"
            className="table-bordered border-1 border-gray-200 shadow-2"
            dataKey="uuid"
          >
            <Column
              header="No"
              className="p-0 m-0"
              style={{ width: '50px' }}
              bodyClassName="text-center font-bold"
              body={(rowData, { rowIndex }) => rowIndex + 1}
            />
            <Column
              header="DIAGNOSTICO"
              field="diagnostico"
              bodyClassName="p-0 m-0"
              style={{ width: '250px' }}
              body={(rowData, { rowIndex }) => (
                <Controller
                  name={`contenido.diagnosticos.items[${rowIndex}].diagnostico`}
                  control={control}
                  rules={REQUIRED_RULE}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextarea
                        {...field}
                        className="w-full border-noround shadow-none"
                        invalid={fieldState.invalid}
                        style={{ minWidth: '250px' }}
                      />
                      <ErrorMessage name={`contenido.diagnosticos.items[${rowIndex}].diagnostico`} />
                    </>
                  )}
                />
              )}
            />
            <Column
              header="P"
              style={{ width: '40px' }}
              bodyStyle={{ width: '40px' }}
              body={(rowData, { rowIndex }) => (
                <Controller
                  name={`contenido.diagnosticos.items[${rowIndex}].p`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                        setValue(`contenido.diagnosticos.items[${rowIndex}].d`, false);
                      }}
                    />
                  )}
                />
              )}
            />
            <Column
              header="D"
              style={{ width: '40px' }}
              bodyStyle={{ width: '40px' }}
              body={(rowData, { rowIndex }) => (
                <Controller
                  name={`contenido.diagnosticos.items[${rowIndex}].d`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                        setValue(`contenido.diagnosticos.items[${rowIndex}].p`, false);
                      }}
                    />
                  )}
                />
              )}
            />
            <Column
              header="CIE"
              field="cie"
              style={{ maxWidth: '300px' }}
              body={(rowData, { rowIndex }) => (
                <Controller
                  name={`contenido.diagnosticos.items[${rowIndex}].cie`}
                  control={control}
                  rules={REQUIRED_RULE}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextarea
                        {...field}
                        style={{ minWidth: '250px' }}
                        className="w-full border-noround shadow-none"
                        invalid={fieldState.invalid}
                      />
                      <ErrorMessage name={`contenido.diagnosticos.items[${rowIndex}].cie`} />
                    </>
                  )}
                />
              )}
            />
            <Column
              header="TIPO"
              field="opcion"
              style={{ minWidth: '167px' }}
              body={(rowData, { rowIndex }) => (
                <Controller
                  name={`contenido.diagnosticos.items[${rowIndex}].opcion`}
                  control={control}
                  rules={REQUIRED_RULE}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        {...field}
                        style={{ minWidth: '167px' }}
                        className="border-noround shadow-none w-full"
                        invalid={fieldState.invalid}
                        options={options}
                      />
                      <ErrorMessage name={`contenido.diagnosticos.items[${rowIndex}].opcion`} />
                    </>
                  )}
                />
              )}
            />
            <Column
              header={<i className={PrimeIcons.TRASH} />}
              className="p-0 m-0 text-center"
              style={{ width: '60px' }}
              body={(rowData) => (
                <Button
                  type="button"
                  size="small"
                  className="p-button-danger"
                  outlined
                  icon={PrimeIcons.TRASH}
                  onClick={onClickEliminar(rowData.uuid)}
                />
              )}
            />
          </DataTable>
        </div>
        <CheckOptionsMultipleInline
          label="SINDROMES GERIATRICOS"
          options={[
            {
              controller: { name: 'contenido.diagnosticos.sindromes.fragilidad' },
              labelText: 'FRAGILIDAD',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.dismovilidad' },
              labelText: 'DISMOVILIDAD',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.depresion' },
              labelText: 'DEPRESION',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.caida' },
              labelText: 'CAIDA',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.delirio' },
              labelText: 'DELIRIO',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.malnutricion' },
              labelText: 'MALNUTRICION',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.ulcerasPorPresion' },
              labelText: 'ULCERAS POR PRESION',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.demencia' },
              labelText: 'DEMENCIA',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.incontinencia' },
              labelText: 'INCONTINENCIA',
            },
            {
              controller: { name: 'contenido.diagnosticos.sindromes.latrogenia' },
              labelText: 'LATROGENIA',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Diagnosticos;
