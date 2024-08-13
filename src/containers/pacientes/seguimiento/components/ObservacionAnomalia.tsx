import Button from '@src/components/Button';
import DeleteRecordConfirm from '@src/components/DeleteRecordConfirm';
import RecordDetail from '@src/components/DeleteRecordConfirm/RecordDetail';
import useDeleteRecordConfirm from '@src/components/DeleteRecordConfirm/useDeleteRecordConfirm';
import DropDown from '@src/components/Forms/DropDown';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import HiddenField from '@src/components/Forms/HiddenField';
import TextArea from '@src/components/Forms/TextArea';
import PaginatedTable from '@src/components/Tables/PaginatedTable';
import { REQUIRED_RULE } from '@src/constants/rules';
import useDeleteItem from '@src/hooks/useDeleteItem';
import useToasts from '@src/hooks/useToasts';
import usePagination from '@src/hooks/v2/usePagination';
import { SeguimientoService } from '@src/services/seguimiento/seguimiento.service';
import { SEGUIMIENTO_URLS } from '@src/services/seguimiento/seguimiento.urls';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const ObservacionAnomalia = ({ idFicha }) => {
  const methods = useForm({ mode: 'onChange' });
  const toast = useToasts();
  const [loadingCreate, setLoadingCreate] = useState(false);

  const pagination = usePagination({
    uri: SEGUIMIENTO_URLS.list,
    key: ['seguimientos-enfermeria', idFicha],
  });

  const onSubmit = async (formData) => {
    setLoadingCreate(true);
    try {
      await new SeguimientoService().create(formData);
      await pagination.refetch();
      toast.addSuccessToast('Registrado correctamente');
      methods.reset({
        observaciones: '',
      });
    } catch (error) {
      toast.addErrorToast('Ha ocurrido un error al momento de procesar tu solicitud');
    }
    setLoadingCreate(false);
  };

  const deleteMutation = useDeleteItem({
    mutationFn: (record) => new SeguimientoService().delete(record.id),
  });

  const { deleteRecordRef, deleteEvent } = useDeleteRecordConfirm();

  return (
    <FormProvider {...methods}>
      <div className="grid grid-nogutter">
        <form className="col-12 grid grid-nogutter justify-content-around">
          <HiddenField name="paciente" defaultValue={idFicha} />
          <div className="field col-12 md:col-3 align-self-center">
            <label htmlFor="tipo">Tipo</label>
            <DropDown
              block
              controller={{
                name: 'tipo',
                defaultValue: 'OBSERVACION',
                rules: {
                  ...REQUIRED_RULE,
                },
              }}
              options={[
                {
                  label: 'OBSERVACIÓN',
                  value: 'OBSERVACION',
                },
                {
                  label: 'ANOMALIA',
                  value: 'ANOMALIA',
                },
              ]}
              loading={loadingCreate}
            />
            <ErrorMessage name="tipo" />
          </div>
          <div className="field col-12 md:col-5">
            <label htmlFor="observaciones">Descripción</label>
            <TextArea
              block
              controller={{
                name: 'observaciones',
                rules: {
                  ...REQUIRED_RULE,
                },
              }}
              loading={loadingCreate}
            />
            <ErrorMessage name="observaciones" />
          </div>
          <div className="field align-self-center col-12 md:col-3">
            <Button block outlined label="Guardar" onClick={methods.handleSubmit(onSubmit)} loading={loadingCreate} />
          </div>
        </form>
        <div className="col-12">
          <DeleteRecordConfirm
            ref={deleteRecordRef}
            messageDetail={(record) => (
              <RecordDetail
                title="Estas seguro de eliminar este registro?"
                items={[
                  ['Tipo', record.tipo],
                  ['Descripción', record.observaciones],
                  ['Registrado por', record.registradoPor],
                ]}
              />
            )}
            onAccept={async (record) => {
              await deleteMutation.deleteRecord(record);
              await pagination.refetch();
            }}
          />
          <PaginatedTable {...pagination.tableProps}>
            <Column
              header="Tipo"
              field="tipo"
              className="text-center w-8rem"
              body={(record) => <p className="p-0 m-0 w-8rem">{record.tipo}</p>}
            />
            <Column
              header="Observacion"
              field="observaciones"
              className="text-justify"
              body={(record) => (
                <p className="p-0 m-0" style={{ minWidth: '10rem' }}>
                  {record.observaciones}
                </p>
              )}
            />
            <Column
              header="Registrado por"
              field="registradoPor"
              className="text-center w-10rem"
              body={(record) => <p className="p-0 m-0 w-10rem">{record.registradoPor}</p>}
            />
            <Column
              header="Fecha de registro"
              field="createdAt"
              className="text-center w-8rem"
              body={(record) => <p className="p-0 m-0 w-8rem">{record.createdAt}</p>}
            />
            <Column
              header="Acciones"
              className="p-0 m-0 text-center w-5rem"
              body={(rowData) =>
                rowData?.canDelete ? (
                  <Button variant="danger" outlined icon={PrimeIcons.TRASH} sm onClick={deleteEvent(rowData)} />
                ) : null
              }
            />
          </PaginatedTable>
        </div>
      </div>
    </FormProvider>
  );
};

export default ObservacionAnomalia;
