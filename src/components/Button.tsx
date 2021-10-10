import classNames from 'classnames';
import { useRouter } from 'next/dist/client/router';
import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from 'primereact/button';
import React, { PropsWithoutRef } from 'react';
import { UrlObject } from 'url';

export interface ButtonProps extends PropsWithoutRef<PrimeButtonProps> {
  href?: UrlObject | string;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'help' | 'success';
  outlined?: boolean;
  block?: boolean;
  sm?: boolean;
  lg?: boolean;
  text?: boolean;
  rounded?: boolean;
  access?: string;

  clipBoardText?: string;
  clipBoardItems?: ClipboardItems;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    sm,
    lg,
    block,
    outlined,
    href,
    text,
    rounded,
    access,
    clipBoardItems,
    clipBoardText,
    variant,
    className,
    onClick,
    ...rest
  } = props;

  const router = useRouter();

  const _onClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick && onClick(evt);
    if (href) {
      router.push(href);
    }

    if (props.clipBoardText) {
      navigator.clipboard.writeText(props.clipBoardText);
    }
    if (props.clipBoardItems) {
      navigator.clipboard.write(props.clipBoardItems);
    }
  };

  return (
    <PrimeButton
      className={classNames(
        {
          'p-button-rounded': rounded,
          [`p-button-${variant}`]: !!variant,
          'p-button-outlined': outlined,
          'p-button-text': text,
          'p-button-sm': sm,
          'p-button-lg': lg || false,
          'w-full': block,
        },
        className,
      )}
      onClick={_onClick}
      {...rest}
    />
  );
};

Button.defaultProps = {
  type: 'button',
};

export default Button;
