import { Column, ColumnProps } from 'primereact/column';
import { DataTable, DataTableBaseProps, DataTableValueArray } from 'primereact/datatable';
import { PropsWithChildren, PropsWithRef, forwardRef } from 'react';

export interface PaginatedTableProps<TValue extends DataTableValueArray>
  extends PropsWithRef<PropsWithChildren<DataTableBaseProps<TValue>>> {
  showIndexColumn?: boolean;
  indexColumnProps?: ColumnProps;
}

const defaultProps: Partial<PaginatedTableProps<any>> = {
  rowHover: true,
  paginator: true,
  stripedRows: true,
  showGridlines: true,
  currentPageReportTemplate: '{currentPage} de {totalPages} | Registros totales {totalRecords}',
  paginatorTemplate: 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
  sortMode: 'multiple',
  emptyMessage: 'No se ha encontrado información',
  lazy: true,
  removableSort: true,
  responsiveLayout: 'scroll',
  filterDisplay: 'row',
  showIndexColumn: true,
};

const PaginatedTable = forwardRef<DataTable<any>, PaginatedTableProps<any>>((props, ref) => {
  const { showIndexColumn, indexColumnProps, ...rest } = props;
  return (
    <DataTable ref={ref} {...defaultProps} {...rest}>
      {showIndexColumn && (
        <Column
          header="#"
          className="text-center font-bold"
          body={(_, rowData) => rowData.rowIndex + 1}
          {...indexColumnProps}
        />
      )}
      {props.children}
    </DataTable>
  );
});

PaginatedTable.displayName = 'PaginatedTable';

export default PaginatedTable;
