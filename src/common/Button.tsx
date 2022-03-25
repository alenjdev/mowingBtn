import { FC } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  size: "small" | "medium" | "large" | "xs";
  type: "primary" | "secondary" | "tertiary" | "exit";
}

export const Button: FC<ButtonProps> = ({
  onClick,
  className,
  children,
  size,
  type,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
      ${styles.btn} 
      ${styles[`btn-${size}`]} 
      ${styles[`btn-${type}`]} 
      ${className}`}
    >
      {children}
    </button>
  );
};
