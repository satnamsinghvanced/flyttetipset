"use client"
import { Button as HeroButton, PressEvent, Spinner } from "@heroui/react";
import {
  ButtonColor,
  ButtonRadius,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  SpinnerPlacement,
} from "../../const/types";

interface HeroButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  variantDefault?: "solid";
  color?: ButtonColor;
  colorDefault?: "default";
  size?: ButtonSize;
  sizeDefault?: "md";
  radius?: ButtonRadius;
  radiusDefault?: "xl";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  spinner?: React.ReactNode;
  spinnerPlacement?: SpinnerPlacement;
  fullWidth?: boolean;
  isIconOnly?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  disableRipple?: boolean;
  disableAnimation?: boolean;
  onPress?: (e: PressEvent) => void;
  onPressStart?: (e: PressEvent) => void;
  onPressEnd?: (e: PressEvent) => void;
  onPressChange?: (pressed: boolean) => void;
  onPressUp?: (e: PressEvent) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
  className?: string;
  buttonType?: ButtonType;
}
const Button = ({
  children,
  startContent,
  endContent,
  onPress,
  variant = "solid",
  color = "default",
  size = "md",
  radius = "sm",
  spinner = <Spinner />,
  spinnerPlacement = "start",
  fullWidth = false,
  isIconOnly = false,
  isDisabled = false,
  isLoading = false,
  disableRipple = false,
  disableAnimation = false,
  onPressStart,
  onPressEnd,
  onPressChange,
  onPressUp,
  onKeyDown,
  onKeyUp,
  className = "",
}:
  HeroButtonProps) => {
  return (
    <HeroButton
      className={`text-[16px] font-semibold ${className}`}
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      startContent={startContent}
      endContent={endContent}
      spinner={spinner}
      spinnerPlacement={spinnerPlacement}
      fullWidth={fullWidth}
      isIconOnly={isIconOnly}
      isDisabled={isDisabled}
      isLoading={isLoading}
      disableRipple={disableRipple}
      disableAnimation={disableAnimation}
      onPress={onPress}
      onPressStart={onPressStart}
      onPressEnd={onPressEnd}
      onPressChange={onPressChange}
      onPressUp={onPressUp}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      {children}
    </HeroButton>
  );
};

export default Button;