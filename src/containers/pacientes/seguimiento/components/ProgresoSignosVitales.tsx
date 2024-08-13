import { SignosVitalesService } from '@src/services/signosVitales/signosVitales.service';
import { toBackDate } from '@src/utils/date';
import { Chart } from 'primereact/chart';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useQuery } from 'react-query';

const ProgresoSignosVitales: React.FC<any> = ({ idFicha }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const query = useQuery<any>(
    ['resumen-signos-mes', selectedDate],
    () => new SignosVitalesService().mes(toBackDate(selectedDate), idFicha),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  return (
    <div className="grid grid-nogutter">
      <div className="col-12 text-center">
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          showMonthYearPicker
          dateFormat="MMMM/yyyy"
          locale="es"
          renderMonthContent={(_, fullMonthText) => <p className="uppercase">{fullMonthText}</p>}
          portalId="root-portal"
          className="p-inputtext p-component font-semibold text-center uppercase"
        />
      </div>
      <div className="col-12 lg:col-6">
        <Chart
          type="line"
          data={{
            labels: query?.data?.pulso?.x,
            datasets: [
              {
                label: 'Pulso',
                data: query?.data?.pulso?.y,
                fill: true,
                borderColor: '#b61921',
              },
            ],
          }}
        />
      </div>
      <div className="col-12 lg:col-6">
        <Chart
          type="line"
          data={{
            labels: query?.data?.temperatura?.x,
            datasets: [
              {
                label: 'Temperatura',
                data: query?.data?.temperatura?.y,
                fill: true,
                borderColor: '#0d5ed8',
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default ProgresoSignosVitales;
