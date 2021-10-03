import Head from 'next/head';
import React, { PropsWithChildren } from 'react';

export interface HeadHtmlProps extends PropsWithChildren<any> {
  title?: string;
}

const HeadHtml: React.FC<HeadHtmlProps> = (props) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{props.title}</title>
      {props.children}
    </Head>
  );
};

HeadHtml.defaultProps = {
  title: 'Mantra',
};
export default HeadHtml;
