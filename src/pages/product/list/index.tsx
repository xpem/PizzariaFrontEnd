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
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";

interface ProductsGroupedByCategoriesProps {
  ProductList: ProductsGroupedByCategoryProps[];
}

export type ProductsGroupedByCategoryProps = {
  id: string;
  name: string;
  products: ProductProps[];
};

type ProductProps = {
  id: string;
  price: string;
  description: string;
  name: string;
};

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

export default function ProductList({
  ProductList,
}: ProductsGroupedByCategoriesProps) {
  const [products, setProducts] = useState(ProductList || []);
  const [loading, setLoading] = useState(false);
  const [delModalVis, setDelModalVis] = useState(false);
  const [modalItem, setModalItem] = useState<ProductProps | null>(null);

  function handleCloseModal() {
    setDelModalVis(false);
  }

  async function handleDelete() {
    try {
      setLoading(true);

      const apiClient = setupAPIClient(undefined);
      console.log(modalItem?.id);

      const res = await apiClient.delete("/product/" + modalItem?.id);

      toast.success("Produto Excluído!");

      handleRefresh();

      setLoading(false);

      handleCloseModal();
    } catch (err) {
      let message: string = "";
      console.log(err);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;

        message = axiosError.response?.data as string;
      } else {
        message = "Ocorreu um erro ao Excluir o produto";
      }
      setLoading(false);
      toast.error(message);
    }
  }

  async function handleRefresh() {
    setLoading(true);
    const apiClient = setupAPIClient(undefined);
    const res = await apiClient.get("/product");
    setProducts(res.data);
    setLoading(false);
  }

  async function handleOpenModalView(Product: ProductProps) {
    setModalItem(Product);
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
                <div key={categoryKey}>
                  {products[categoryKey as any].products.length > 0 && (
                    <div className={styles.CategoryName}>
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
                            onClick={() => handleOpenModalView(product)}
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
        {/* delete function */}
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
    const res = await apiClient.get("/product");
    console.log(res.data);
    return { props: { ProductList: res.data } };
  }
);
