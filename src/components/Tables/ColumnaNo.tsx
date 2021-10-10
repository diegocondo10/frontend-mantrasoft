import { Column } from 'primereact/column';
import React from 'react';

const ColumnaNo = () => {
  return (
    <Column
      header="No"
      body={(_, rowData) => (
        <strong>
          {
            //@ts-ignore
            rowData?.rowIndex + 1
          }
        </strong>
      )}
    />
  );
};

export default ColumnaNo;
