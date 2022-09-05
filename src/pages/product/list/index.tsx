import { Header } from "../../../components/ui/Header";
import Head from "next/head";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import styles from "./styles.module.scss";
import Router from "next/router";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { ButtonPrimary } from "../../../components/ui/ButtonPrimary";

interface ProductsGroupedByCategoriesProps {
  ProductList: ProductsGroupedByCategoryProps[];
}

export type ProductsGroupedByCategoryProps = {
  id: string;
  name: string;
  products: Product[];
};

type Product = {
  id: string;
  price: string;
  description: string;
  name: string;
};

export default function ProductList({
  ProductList,
}: ProductsGroupedByCategoriesProps) {
  const [products, setProducts] = useState(ProductList || []);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Categorias - Pizzaria</title>
      </Head>
      <Header></Header>
      <div>
        <main className={styles.container}>
          <h1>Cardápio</h1>
          <hr style={{ color: "var(--white)" }} />
          <ButtonPrimary
            type="button"
            onClick={() =>
              Router.push({
                pathname: "/product/create",
              })
            }
            style={{ marginTop: "1rem" }}
          >
            Cadastrar Produto
          </ButtonPrimary>
          <article className={styles.list}>
            {products.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum produto cadastrado
              </span>
            )}
            {Object.keys(products).map((categoryKey) => {
              return (
                <div>
                  {products[categoryKey as any].products.length > 0 && (
                    <div className={styles.CategoryName} key={categoryKey}>
                      <span>{products[categoryKey as any].name}</span>
                    </div>
                  )}
                  {products[categoryKey as any].products.map((product) => {
                    return (
                      <section className={styles.Item} key={product.id}>
                        <div className={styles.itemButton}>
                          {/* <div className={styles.tag}></div> */}
                          <div className={styles.productContainer}>
                            <div className={styles.nameAndPrice}>
                              <span>&#x2022; {product.name}</span>
                              <span>R$ {product.price}</span>
                            </div>
                            <div className={styles.descriptionContainer}>
                              <span className={styles.description}>
                                {product.description}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.iconsContainer}>
                          <button
                            className={
                              styles.itemButton +
                              " " +
                              styles.itemButtonTransition
                            }
                            onClick={() =>
                              Router.push({
                                pathname: "/product/update/",
                                query: { id: product.id },
                              })
                            }
                          >
                            <FiEdit2 size={25} color="#ffff3d"></FiEdit2>
                          </button>
                          <button
                            className={
                              styles.itemButton +
                              " " +
                              styles.itemButtonTransition
                            }
                          >
                            <FiTrash2
                              className={styles.delete}
                              size={25}
                              color="#f34748"
                            ></FiTrash2>
                          </button>
                        </div>
                      </section>
                    );
                  })}
                </div>
              );
            })}
          </article>
        </main>

        {/* <main className={styles.container}>
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
        )} */}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(
  async (ctx: GetServerSidePropsContext) => {
    const apiClient = setupAPIClient(ctx);
    const res = await apiClient.get("/product");
    console.log(res.data);
    return { props: { ProductList: res.data } };
  }
);
