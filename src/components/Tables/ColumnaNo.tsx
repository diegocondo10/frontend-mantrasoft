import { Column } from 'primereact/column';
import React from 'react';

const ColumnaNo = () => {
  return (
    <Column
      header="No"
      bodyClassName="text-center"
      headerClassName="text-center"
      body={(_, rowData) => (
        <strong className="text-center">
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
