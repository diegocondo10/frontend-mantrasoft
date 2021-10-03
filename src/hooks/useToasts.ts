import axios from 'axios';
import _ from 'lodash';
import { ReactNode } from 'react';
import {
  AddToast,
  AppearanceTypes,
  Options,
  RemoveAllToasts,
  RemoveToast,
  UpdateToast,
  useToasts as baseHook,
} from 'react-toast-notifications';

type CallbackType = (id: string) => void;

type ToatsType = (content: ReactNode, extraProps?: Options, callback?: CallbackType) => void;

export interface UseToastsProps {
  addSuccessToast: ToatsType;
  addErrorToast: ToatsType;
  addWarningToast: ToatsType;
  addInfoToast: ToatsType;
  addToast: AddToast;
  removeToast: RemoveToast;
  removeAllToasts: RemoveAllToasts;
  toastStack: Array<{
    content: ReactNode;
    id: string;
    appearance: AppearanceTypes;
  }>;
  updateToast: UpdateToast;
  addApiErrorToast: Function;
}

export interface BaseToastProps {
  content: string;
  extraProps?: Options;
  callback?: CallbackType;
}
const ToatsTypes = ['Error', 'Info', 'Success', 'Warning'];

const useToasts = (): UseToastsProps => {
  const { addToast, ...rest } = baseHook();

  const baseToast = ({ content, extraProps, callback }: BaseToastProps, appearance: AppearanceTypes): void => {
    addToast(content, { ...extraProps, appearance }, callback);
  };

  const buildToast = () => {
    const entries = ToatsTypes.map((toastType) => {
      return [
        `add${toastType}Toast`,
        (content: string, extraProps?: Options, callback?: CallbackType) => {
          baseToast({ content, extraProps, callback }, toastType.toLowerCase() as AppearanceTypes);
        },
      ];
    });

    return Object.fromEntries(entries);
  };

  const addApiErrorToast = (
    error: Error,
    { level = 'warning', path = 'nonFieldErrors' }: { level?: AppearanceTypes; path?: string },
  ) => {
    if (axios.isAxiosError(error)) {
      baseToast(
        {
          content: _.get(error?.response?.data, path, ''),
        },
        level,
      );
    }
  };

  return {
    ...buildToast(),
    ...rest,
    addApiErrorToast,
  };
};

export default useToasts;
