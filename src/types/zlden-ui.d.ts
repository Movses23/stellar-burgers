declare module '@zlden/react-developer-burger-ui-components' {
  import * as React from 'react';

  export type TButtonType = 'primary' | 'secondary';
  export type TButtonSize = 'large' | 'medium' | 'small';
  export type TButtonHtmlType = 'button' | 'submit' | 'reset';

  export interface ButtonProps {
    type?: TButtonType;
    size?: TButtonSize;
    htmlType?: TButtonHtmlType;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    extraClass?: string;
    children?: React.ReactNode;
  }
  export const Button: React.FC<ButtonProps>;

  export type TInputSize = 'default' | 'small' | 'large';
  export type TInputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url';
  export type TIcon = 'EditIcon' | 'HideIcon' | 'ShowIcon' | string;

  export interface InputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'onChange' | 'value'
  > {
    type?: TInputType;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    name?: string;
    error?: boolean;
    errorText?: string;
    size?: TInputSize;
    icon?: TIcon;
    onIconClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    extraClass?: string;
  }
  export const Input: React.FC<InputProps>;

  export interface PasswordInputProps {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    name?: string;
    extraClass?: string;
  }
  export const PasswordInput: React.FC<PasswordInputProps>;

  export interface TabProps {
    value: string;
    active: boolean;
    onClick: (value: string) => void;
    children?: React.ReactNode;
  }
  export const Tab: React.FC<TabProps>;

  export interface CounterProps {
    count: number;
    size?: 'default' | 'small';
    extraClass?: string;
  }
  export const Counter: React.FC<CounterProps>;

  export interface IconProps {
    type?: 'primary' | 'secondary' | 'error' | 'success' | 'disabled';
  }
  export const BurgerIcon: React.FC<IconProps>;
  export const ListIcon: React.FC<IconProps>;
  export const ProfileIcon: React.FC<IconProps>;
  export const CloseIcon: React.FC<IconProps>;
  export const CurrencyIcon: React.FC<IconProps>;

  export const Logo: React.FC<Record<string, never>>;

  export interface ConstructorElementProps {
    type?: 'top' | 'bottom';
    isLocked?: boolean;
    text: string;
    price: number;
    thumbnail: string;
    extraClass?: string;
    handleClose?: () => void;
  }
  export const ConstructorElement: React.FC<ConstructorElementProps>;

  export interface MoveButtonProps {
    handleMoveUp: () => void;
    handleMoveDown: () => void;
    isUpDisabled?: boolean;
    isDownDisabled?: boolean;
  }
  export const MoveButton: React.FC<MoveButtonProps>;

  export interface RefreshButtonProps {
    text: string;
    onClick: () => void;
    extraClass?: string;
  }
  export const RefreshButton: React.FC<RefreshButtonProps>;
}
