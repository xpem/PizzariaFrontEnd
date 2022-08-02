import Link from "next/link";
import styles from "./styles.module.scss";
import { FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
export function Header() {
  const { signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <span className={styles.HeaderLogo}>Pizzaria</span>
          {/* <img src="/logo.svg" width={190} height={60}></img> */}
        </Link>
        <nav className={styles.menuNav}>
          <Link href="/category/list">
            <a>Categorias</a>
          </Link>
          <Link href="/product">
            <a>Cardápio</a>
          </Link>
          <button onClick={signOut}>
            <FiLogOut color="#fff" size={24}></FiLogOut>
          </button>
        </nav>
      </div>
    </header>
  );
}
