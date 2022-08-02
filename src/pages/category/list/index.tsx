import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { Header } from "../../../components/ui/Header";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import styles from "./styles.module.scss";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import Router from "next/router";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";
import ReactModal from "react-modal";
import { Button } from "../../../components/ui/Button";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const filteredCaterogies =
    search.length > 0
      ? categories.filter((categories) => categories.name.includes(search))
      : [];

  async function handleOpenModalView(Category: CategoryProps) {
    console.log(Category.name);
    setModalItem(Category);
    setDelModalVis(true);
  }

  function handleCloseModal() {
    setDelModalVis(false);
  }

  async function handleDelete() {
    try {
      setLoading(true);

      const apiClient = setupAPIClient(undefined);

      const res = await apiClient.delete("/category/" + modalItem?.id);

      toast.success("Categoria Excluída!");

      handleRefreshOrders();

      setLoading(false);

      handleCloseModal();
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Ocorreu um erro ao atualizar a categoria");
    }
  }

  async function handleRefreshOrders() {
    setLoading(true);
    const apiClient = setupAPIClient(undefined);
    const res = await apiClient.get("/category");
    setCategories(res.data);
    setLoading(false);
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
                  <button
                    className={
                      styles.itemButton + " " + styles.itemButtonTransition
                    }
                    onClick={() =>
                      Router.push({
                        pathname: "/category/update/",
                        query: { id: item.id },
                      })
                    }
                  >
                    <FiEdit2 size={25} color="#ffff3d"></FiEdit2>
                  </button>
                  <button
                    className={
                      styles.itemButton + " " + styles.itemButtonTransition
                    }
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
            onRequestClose={handleCloseModal}
          >
            <div className={styles.modalContainer}>
              <button
                type="button"
                onClick={handleCloseModal}
                className={
                  styles.buttonBack + " " + styles.itemButtonTransition
                }
                style={{ background: "transparent", border: 0 }}
              >
                <FiX size={25} color="var(--white)"></FiX>
              </button>
              <h2>Excluir Categoria</h2>
              <section className={styles.containerItem}>
                <span className={styles.item}>{modalItem?.name}</span>
              </section>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <ButtonPrimary
                  onClick={handleDelete}
                  style={{
                    width: "200px",
                    backgroundColor: "var(--red-900)",
                    color: "var(--white)",
                  }}
                >
                  Excluir
                </ButtonPrimary>
              </div>
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
