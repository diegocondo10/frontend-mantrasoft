import Loading, { LoadingWrapperProps } from '@src/components/Loading';
import { PrimeIcons } from 'primereact/api';
import { ScrollTop } from 'primereact/scrolltop';
import React, { useRef } from 'react';
import HeadHtml, { HeadHtmlProps } from './components/HeadHtml';

export interface BaseLayoutProps extends HeadHtmlProps {
  header?: React.ReactNode;
  loading?: LoadingWrapperProps;
}

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const headerRef = useRef<HTMLElement>(null);
  return (
    <React.Fragment>
      <HeadHtml title={props.title} />
      <div className="d-flex flex-row vh-100 w-100">
        <div className="d-flex flex-column w-100">
          {props.header && <header ref={headerRef}>{props.header}</header>}
          <Loading {...props?.loading}>
            <div
              className="m-0 p-0"
              style={{
                overflowY: 'auto',
                height: `calc(100% - ${headerRef?.current?.offsetHeight || 0})`,
                scrollBehavior: 'smooth',
              }}
            >
              {props.children}
              <ScrollTop
                target="parent"
                threshold={400}
                className="p-button-primary bg-green-400"
                icon={PrimeIcons.ARROW_UP}
              />
            </div>
          </Loading>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BaseLayout;
