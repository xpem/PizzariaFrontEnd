import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { Header } from "../../../components/ui/Header";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import styles from "./styles.module.scss";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

type CategoryProps = {
  id: string;
  name: string;
};

interface CategoriesProps {
  CategoryList: CategoryProps[];
}

export default function CategoryList({ CategoryList }: CategoriesProps) {
  const [categories, setCategories] = useState(CategoryList || []);

  return (
    <>
      <Head>
        <title>Categorias - Pizzaria</title>
      </Head>
      <Header></Header>
      <div>
        <main className={styles.container}>
          <h1>Categorias</h1>
          <button type="submit" className={styles.buttonAdd}>
           Cadastrar
            </button>
          <article className={styles.list}>
            {categories.length === 0 && (
              <span className={styles.emptyList}>
                Nenhuma categoria cadastrada
              </span>
            )}
            {categories.map((item) => (
              <section className={styles.Item}>
                <div className={styles.itemButton} >
                  <div className={styles.tag}></div>
                  <span>{item.name}</span>
                </div>
                <div className={styles.iconsContainer}>
                  <button className={styles.itemButton}>
                    <FiEdit2
                      size={25}
                      color="#ffff3d"
                    ></FiEdit2>
                  </button>
                  <button className={styles.itemButton}>
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
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(
  async (ctx: GetServerSidePropsContext) => {
    const apiClient = setupAPIClient(ctx);
    const res = await apiClient.get("/category");

    console.log(res.data);
    return { props: { CategoryList: res.data } };
  }
);
