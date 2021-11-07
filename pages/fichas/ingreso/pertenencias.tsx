import { CSSProperties } from '@emotion/react/node_modules/@emotion/serialize';
import Button from '@src/components/Button';
import ButtonMenu from '@src/components/ButtonMenu';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextArea from '@src/components/Forms/TextArea';
import TextInput from '@src/components/Forms/TextInput';
import ColumnaNo from '@src/components/Tables/ColumnaNo';
import PrivateLayout from '@src/layouts/PrivateLayout';
import API from '@src/services/api';
import { urlInfoPacienteFichaIngreso } from '@src/services/urls';
import { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

const PertenenciasPage: NextPage<{ id?: string | number }> = (props) => {
  const query = useQuery<AxiosResponse<any>>(['info', props.id], () =>
    API.private().get(urlInfoPacienteFichaIngreso(props.id)),
  );

  const [id, setId] = useState(null);

  const methods = useForm({ mode: 'onChange' });

  const [modalShow, setModalShow] = useState(false);

  const toggle = () => {
    setModalShow(!modalShow);
    methods.reset({});
  };

  const onSubmit = async (formData) => {
    console.log(formData);
  };

  const referencias = query?.data?.data?.pertenencias
    ?.filter?.((pertenencia) => pertenencia?.tipo === 'INGRESO' && !pertenencia?.referencia && pertenencia.id !== id)
    ?.map?.((referencia) => ({ label: referencia?.descripcion, value: referencia?.id }));
  return (
    <PrivateLayout title="Ficha de salida" loading={{ loading: query.isLoading }}>
      <main className="container">
        <div className="d-flex flex-row justify-content-center mt-5">
          <Button className="align-self-center" href="/fichas/ingreso" icon={PrimeIcons.ARROW_LEFT} outlined rounded />
          <h1 className="text-center align-self-center">
            Registro de cosas del paciente{' '}
            <Button
              outlined
              variant="success"
              icon={PrimeIcons.PLUS}
              rounded
              onClick={() => {
                toggle();
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
            >
              {ColumnaNo()}
              <Column header="Código" field="codigo" />
              <Column header="Tipo" field="tipo" />
              <Column header="Cantidad" field="cantidad" />
              <Column header="Descripción" field="descripcion" />
              <Column
                style={{ width: '160px' } as CSSProperties}
                header="Opciones"
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
              <div className="d-flex flex-row">
                <div className="w-50 my-3">
                  <label htmlFor="tipo">Tipo: *</label>
                  <DropDown
                    className="w-full"
                    controller={{ name: 'tipo', rules: { required: 'Este campo es obligatorio' } }}
                    options={['INGRESO', 'SALIDA']}
                  />
                  <ErrorMessage name="tipo" />
                </div>
                <div className="w-50 my-3">
                  <label htmlFor="cantidad">Cantidad: *</label>
                  <TextInput
                    block
                    min={1}
                    max={9999}
                    keyfilter="int"
                    controller={{ name: 'cantidad', rules: { required: 'Este campo es obligatorio' }, defaultValue: 1 }}
                    type="number"
                  />
                  <ErrorMessage name="cantidad" />
                </div>
              </div>

              {methods.watch('tipo') === 'SALIDA' && referencias?.length > 0 && (
                <div>
                  <label>Referencia: *</label>
                  <DropDown
                    className="w-full"
                    controller={{ name: 'tipo', rules: { required: 'Este campo es obligatorio' } }}
                    options={referencias}
                  />
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
