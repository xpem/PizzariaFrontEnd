import { FormEvent, useContext, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import styles from "../../styles/home.module.scss";
import Head from "next/head";
import logoImg from "../../public/logo.svg";
import Image from "next/image";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";

const Home: NextPage = () => {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "") {
      toast.warning("Preencha os campos");
      return;
    }

    setLoading(true);

    let data = { email, password };

    await signIn(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Pizzaria - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo pizzaria"></Image>

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit" loading={loading}>
              Acessar
            </Button>
          </form>
          <Link href="/signup">
            <a className={styles.text}>Não possui uma conta? Cadastre-se</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});

export default Home;
