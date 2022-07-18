import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/home.module.scss";
import logoImg from "../../../public/logo.svg";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const SignUp: NextPage = () => {
  const { signUp } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (name === "" || email === "" || password === "") {
      toast.warning("Preencha todos os campos");
      return;
    }

    setLoading(true);

    await signUp({ name, email, password });

    setLoading(false);
  }
  return (
    <>
      <Head>
        <title>Faça seu cadastro agora</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo pizzaria"></Image>
        <div className={styles.login}>
          <h1>Criando sua conta</h1>
          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Input>
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
              Cadastrar
            </Button>
          </form>
          <Link href="/">
            <a className={styles.text}>Já possui uma conta? Faça seu login</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
