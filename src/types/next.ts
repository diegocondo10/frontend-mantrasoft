import { NextPageContext } from 'next';
import { BaseContext } from 'next/dist/shared/lib/utils';
import { ComponentType } from 'react';

export declare type NextComponentType<C extends BaseContext = NextPageContext, IP = {}, P = {}> = ComponentType<P> & {
  getInitialProps?(context: C): IP | Promise<IP>;
  help?: {
    title: string;
    content: string;
  };
};

export type CustomNextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P>;
