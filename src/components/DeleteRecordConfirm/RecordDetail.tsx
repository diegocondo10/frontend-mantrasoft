import React from 'react';

type RecordItem = { label: string; value: string } | [string, string];

interface RecordDetailProps {
  items: RecordItem[];
  title: string;
}

const RecordDetail: React.FC<RecordDetailProps> = React.memo(
  ({ items, title }) => {
    return (
      <div className="grid mt-1">
        <div className="col-12">
          <div className="text-center text-xl font-bold">{title}</div>
        </div>
        {items.map((item, index) => {
          const isTuple = Array.isArray(item);
          const label = isTuple ? item[0] : item.label;
          const value = isTuple ? item[1] : item.value;

          return (
            <React.Fragment key={index}>
              <div className="col-4 label text-right detail-grid-border">{label}</div>
              <div className="col-8 value detail-grid-border">{value}</div>
            </React.Fragment>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.items === nextProps.items && prevProps.title === nextProps.title;
  },
);

export default RecordDetail;
