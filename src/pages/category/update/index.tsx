import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import { Header } from "../../../components/ui/Header";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import styles from "../form.module.scss";

type CategoryProps = {
  Category: {
    id: string;
    name: string;
  };
};

export default function CategoryEdit({ Category }: CategoryProps) {
  const [name, setName] = useState(Category.name);
  const nameOri = Category.name;
  const [id, setId] = useState(Category.id);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEdit(e: FormEvent) {
    e.preventDefault();

    const { id } = router.query;

    if (name === "") {
      toast.warning("Defina um nome");
      return;
    }

    if (name !== nameOri) {
      try {
        setLoading(true);
        const apiClient = setupAPIClient(undefined);
        const res = await apiClient.put("/category/" + id, { name });
        console.log(res.data);
        toast.success("Categoria Alterada");
        setName("");
        setLoading(false);
        Router.push("/category/list");
      } catch (err) {
        setLoading(false);
        console.log(err);
        toast.error("Ocorreu um erro ao atualizar a categoria");
      }
    }
  }

  return (
    <>
      <Head>
        <title>Editar categoria - Pizzaria</title>
      </Head>
      <Header></Header>
      <div>
        <main className={styles.container}>
          <h1>Editar Categoria</h1>
          <form className={styles.form} onSubmit={handleEdit}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <ButtonPrimary type="submit" loading={loading}>
              Confirmar
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

export const getServerSideProps = canSSRAuth(
  async (ctx: GetServerSidePropsContext) => {
    const apiClient = setupAPIClient(ctx);
    const res = await apiClient.get("/category/" + ctx.query.id);
    return { props: { Category: res.data[0] } };
  }
);
