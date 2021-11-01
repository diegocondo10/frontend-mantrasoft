import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import React, { useRef } from 'react';
import HrefButton, { ButtonProps } from './Button';

export interface ButtonMenuProps extends ButtonProps {
  label?: string;
  icon?: string;
  items?: MenuItem[];
}
const ButtonMenu: React.FC<ButtonMenuProps> = (props) => {
  const ref = useRef<Menu>(null);
  return (
    <React.Fragment>
      <Menu popup id={props.label} ref={ref} model={props.items} />
      <HrefButton
        label={props.label}
        icon={props.icon}
        onClick={(e) => ref.current.toggle(e)}
        aria-controls={props.label}
        aria-haspopup
        {...props}
      />
    </React.Fragment>
  );
};

export default ButtonMenu;
