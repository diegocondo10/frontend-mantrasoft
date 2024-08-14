import Loading, { LoadingWrapperProps } from '@src/components/Loading';
import { PrimeIcons } from 'primereact/api';
import { ScrollTop } from 'primereact/scrolltop';
import React, { useRef } from 'react';
import { HeadHtmlProps } from './components/HeadHtml';

export interface BaseLayoutProps extends HeadHtmlProps {
  header?: React.ReactNode;
  loading?: LoadingWrapperProps;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ header, loading, title, children }) => {
  const headerRef = useRef<HTMLElement>(null);
  return (
    <>
      {/* <HeadHtml title={title} /> */}
      <div className="flex flex-row h-screen w-full">
        <div className="flex flex-column w-full">
          {header && <header ref={headerRef}>{header}</header>}
          <Loading {...loading}>
            <div
              className="m-0 p-0 overflow-y-auto"
              style={{
                height: `calc(100% - ${headerRef.current?.offsetHeight || 0}px)`,
                scrollBehavior: 'smooth',
              }}
            >
              {children}
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
    </>
  );
};

export default BaseLayout;
