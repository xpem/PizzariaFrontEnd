import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { Header } from "../../../components/ui/Header";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import styles from "./styles.module.scss";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import Router from "next/router";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import ReactModal from "react-modal";
import { Button } from "../../../components/ui/Button";

type CategoryProps = {
  id: string;
  name: string;
};

interface CategoriesProps {
  CategoryList: CategoryProps[];
}

const customStyles = {
  content: {
    top: "50%",
    bottom: "auto",
    left: "50%",
    right: "auto",
    padding: "30px",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1d1d2e",
  },
};

export default function CategoryList({ CategoryList }: CategoriesProps) {
  const [categories, setCategories] = useState(CategoryList || []);
  const [delModalVis, setDelModalVis] = useState(false);
  const [modalItem, setModalItem] = useState<CategoryProps | null>(null);

  async function handleOpenModalView(Category: CategoryProps) {
    console.log(Category.name);
    setModalItem(Category);
    setDelModalVis(true);
  }

  return (
    <>
      <Head>
        <title>Categorias - Pizzaria</title>
      </Head>
      <Header></Header>
      <div>
        <main className={styles.container}>
          <h1>Categorias</h1>
          <ButtonPrimary
            type="button"
            onClick={() =>
              Router.push({
                pathname: "/category/create",
              })
            }
            style={{ marginTop: "1rem" }}
          >
            Cadastrar
          </ButtonPrimary>
          <article className={styles.list}>
            {categories.length === 0 && (
              <span className={styles.emptyList}>
                Nenhuma categoria cadastrada
              </span>
            )}
            {categories.map((item) => (
              <section className={styles.Item}>
                <div className={styles.itemButton}>
                  <div className={styles.tag}></div>
                  <span>{item.name}</span>
                </div>
                <div className={styles.iconsContainer}>
                  <ButtonPrimary
                    className={styles.itemButton}
                    onClick={() =>
                      Router.push({
                        pathname: "/category/update/",
                        query: { id: item.id },
                      })
                    }
                  >
                    <FiEdit2 size={25} color="#ffff3d"></FiEdit2>
                  </ButtonPrimary>
                  <button
                    className={styles.itemButton}
                    onClick={() => handleOpenModalView(item)}
                  >
                    <FiTrash2
                      className={styles.delete}
                      size={25}
                      color="#f34748"
                    ></FiTrash2>
                  </button>
                </div>
              </section>
            ))}
          </article>
        </main>
        {delModalVis && (
          <ReactModal
            isOpen={delModalVis}
            style={customStyles}
            onRequestClose={() => setDelModalVis(false)}
          >
            <div className={styles.modalContainer}>
              <h2>Excluir Categoria</h2>
              <span className={styles.item}> - {modalItem?.name}</span>
              <Button>Excluir Categoria</Button>
            </div>
          </ReactModal>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(
  async (ctx: GetServerSidePropsContext) => {
    const apiClient = setupAPIClient(ctx);
    const res = await apiClient.get("/category");
    return { props: { CategoryList: res.data } };
  }
);
