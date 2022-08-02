import Head from "next/head";
import Router from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/Button";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import { Header } from "../../../components/ui/Header";
import { setupAPIClient } from "../../../services/api";
import styles from "../form.module.scss";
import { FiArrowLeft } from "react-icons/fi";

export default function Category() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (name === "") {
        toast.warning("Defina um nome");
        setLoading(false);
        return;
      }

      const apiClient = setupAPIClient(undefined);
      const res = await apiClient.post("/category", { name });
      Router.push("/category/list");
      toast.success("Categoria cadastrada");
      setName("");

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Ocorreu um erro ao atualizar a categoria");
    }
  }

  return (
    <>
      <Head>
        <title>Nova categoria - Pizzaria</title>
      </Head>
      <Header></Header>
      <div>
        <main className={styles.container}>
          <h1>Cadastrar categorias</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <ButtonPrimary type="submit" loading={loading}>
              Cadastrar
            </ButtonPrimary>
          </form>
          <button
            type="button"
            onClick={() => Router.back()}
            className={styles.itemButtonTransition}
            style={{ background: "transparent", border: 0, alignSelf: "start" }}
          >
            <FiArrowLeft size={25} color="var(--white)"></FiArrowLeft>
          </button>
        </main>
      </div>
    </>
  );
}
