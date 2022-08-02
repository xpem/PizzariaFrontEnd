import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.scss";
import { FaSpinner } from "react-icons/fa";

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

export function ButtonPrimary({ loading, children, ...rest }: ButtonPrimaryProps) {
  return (
    <button className={styles.buttonPrimary} disabled={loading} {...rest}>
      {loading ? (
        <FaSpinner color="var(--dark-700)" size={16}></FaSpinner>
      ) : (
        <a>{children}</a>
      )}
    </button>
  );
}