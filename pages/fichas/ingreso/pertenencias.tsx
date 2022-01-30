import { CSSProperties } from '@emotion/react/node_modules/@emotion/serialize';
import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import HiddenField from '@src/components/Forms/HiddenField';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlCreatePertenencia, urlInfoPacienteFichaIngreso, urlUpdatePertenencia } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

const PertenenciasPage: NextPage<{ id?: string | number }> = (props) => {
  const query = useQuery<AxiosResponse<any>>(['info', props.id], () =>
    API.private().get(urlInfoPacienteFichaIngreso(props.id)),
  );
  const [expandedRows, setExpandedRows] = useState(null);
  const [id, setId] = useState(null);

  const methods = useForm({ mode: 'onChange', shouldUnregister: true });

  const [modalShow, setModalShow] = useState(false);

  const mutation = useMutation((ws: any) => ws);

  const toggle = () => {
    setModalShow(!modalShow);
    methods.reset({});
    setId(null);
  };

  const onSubmit = async (formData) => {
    console.log(formData);
    formData.registro = props.id;
    try {
      if (id) {
        await mutation.mutateAsync(API.private().put(urlUpdatePertenencia(id), formData));
      } else {
        await mutation.mutateAsync(API.private().post(urlCreatePertenencia, formData));
      }
      query.refetch();
      toggle();
    } catch (error) {
      console.log(error);
      query.refetch();
      toggle();
    }
  };

  const rowExpandTemplate = (rowData) => {
    return (
      <div className="w-full">
        <h4 className="text-center">Registros de sálida</h4>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex flex-row justify-content-between border">
            <div style={{ width: '100px' }} className="text-center font-bold">
              Cantidad
            </div>
            <div className="w-full text-center font-bold">Descripción</div>
            <div style={{ width: '250px' }} className="text-center font-bold">
              Fecha | Hora
            </div>
          </li>
          {rowData?.salidas?.map?.((salida) => (
            <li className="list-group-item d-flex flex-row justify-content-between border" key={salida.id}>
              <div style={{ width: '100px' }} className="text-center">
                {salida.cantidad}
              </div>
              <div className="w-full">{salida.descripcion}</div>
              <div style={{ width: '250px' }} className="text-center">
                {salida.fechaRegistro}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <PrivateLayout title="Ficha de salida" loading={{ loading: query.isLoading }}>
      <main className="container">
        <div className="d-flex flex-row justify-content-center mt-5">
          <h1 className="text-center align-self-center">
            <Button
              className="align-self-center"
              href="/fichas/ingreso"
              icon={PrimeIcons.ARROW_LEFT}
              outlined
              rounded
            />
            Registro de pertenencias del paciente
            <Button
              outlined
              variant="success"
              icon={PrimeIcons.PLUS}
              rounded
              onClick={() => {
                toggle();
                methods.setValue('tipo', 'INGRESO');
              }}
            />
          </h1>
        </div>
        <h3 className="text-center mb-5">{query?.data?.data?.paciente?.str}</h3>
        <div className="row justify-content-center">
          <div className="col-12">
            <DataTable
              value={query?.data?.data?.pertenencias || []}
              showGridlines
              rowHover
              autoLayout
              className="border"
              paginator
              rows={20}
              rowsPerPageOptions={[20, 30, 50]}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpandTemplate}
            >
              <Column expander style={{ width: '3em' }} />
              {ColumnaNo()}
              <Column header="Código" field="codigo" headerClassName="text-center" />
              <Column header="Cantidad inicial" field="cantidad" headerClassName="text-center" />
              <Column header="Cantidad actual" field="cantidadActual" headerClassName="text-center" />
              <Column header="Descripción" field="descripcion" headerClassName="text-center" />
              <Column
                style={{ width: '160px' } as CSSProperties}
                header="Opciones"
                headerClassName="text-center"
                bodyClassName="p-1 m-1"
                body={(rowData) => (
                  <ButtonMenu
                    block
                    variant="secondary"
                    label="Opciones"
                    icon={PrimeIcons.COG}
                    items={[
                      {
                        icon: PrimeIcons.PENCIL,
                        label: 'Editar',
                        command: () => {
                          toggle();
                          setId(rowData.id);
                          methods.reset(rowData);
                        },
                      },
                      {
                        icon: PrimeIcons.SIGN_OUT,
                        label: 'Registrar salida',
                        command: () => {
                          if (rowData.cantidadActual === 0) {
                            return alert('No se puede registrar una salida más, porque la cantidad actual es 0');
                          }
                          toggle();
                          methods.setValue('tipo', 'SALIDA');
                          methods.setValue('referencia', rowData.id);
                          methods.setValue('referenciaObj', rowData);
                        },
                      },
                    ]}
                  />
                )}
              />
            </DataTable>
          </div>
        </div>
      </main>

      <FormProvider {...methods}>
        <Modal show={modalShow} centered onHide={toggle}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title>Formulario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <HiddenField name="referencia" defaultValue={null} />
              <HiddenField name="referenciaObj" defaultValue={null} />
              <div className="w-full my-3">
                <TextInput
                  className="w-full text-800 font-bold"
                  controller={{ name: 'tipo', rules: { required: 'Este campo es obligatorio' } }}
                  disabled
                />
                <ErrorMessage name="tipo" />
              </div>

              <div className="w-full my-3">
                <label htmlFor="cantidad">Cantidad: *</label>
                {!methods.watch('referenciaObj') && (
                  <TextInput
                    block
                    min={1}
                    max={9999}
                    keyfilter="int"
                    controller={{ name: 'cantidad', rules: { required: 'Este campo es obligatorio' }, defaultValue: 1 }}
                    type="number"
                  />
                )}
                {methods.watch('referenciaObj') && (
                  <TextInput
                    block
                    min={1}
                    max={methods.watch('referenciaObj')?.cantidadActual}
                    keyfilter="int"
                    controller={{ name: 'cantidad', rules: { required: 'Este campo es obligatorio' }, defaultValue: 1 }}
                    type="number"
                  />
                )}
                <ErrorMessage name="cantidad" />
              </div>

              {id && (
                <div className="w-full my-3">
                  <label htmlFor="cantidadActual">Cantidad actual: *</label>
                  <TextInput
                    block
                    min={1}
                    max={9999}
                    keyfilter="int"
                    controller={{
                      name: 'cantidadActual',
                      rules: { required: 'Este campo es obligatorio' },
                      defaultValue: 1,
                    }}
                    type="number"
                  />
                  <ErrorMessage name="cantidadActual" />
                </div>
              )}

              <div className="w-full my-3">
                <label htmlFor="descripcion">Descripción: *</label>
                <TextArea
                  block
                  rows={10}
                  controller={{
                    name: 'descripcion',
                    rules: { required: 'Este campo es obligatorio' },
                  }}
                />
                <ErrorMessage name="descripcion" />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" label="Guardar" icon={PrimeIcons.SAVE} outlined />
            </Modal.Footer>
          </form>
        </Modal>
      </FormProvider>
    </PrivateLayout>
  );
};

PertenenciasPage.getInitialProps = ({ query }) => query as any;

export default PertenenciasPage;
