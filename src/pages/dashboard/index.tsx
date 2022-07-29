import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { Header } from "../../components/ui/Header";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import stl from "./styles.module.scss";
import Modal from "react-modal";
import { ModalOrder } from "../../components/ModalOrder";
import { toast } from "react-toastify";

type ItemProps = {
  id: string;
  name: string | null;
  table: string | number;
  status: boolean;
  draft: boolean;
};

interface OrderProps {
  OrderList: ItemProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  };
  order: ItemProps;
};

export default function Dasboard({ OrderList }: OrderProps) {
  const [orders, setOrders] = useState(OrderList || []);
  const [modalItem, setModalItem] = useState<OrderItemProps[] | []>();
  const [modalVis, setModalVis] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleCloseModal() {
    setModalVis(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient(undefined);

    console.log(id);

    const res = await apiClient.get("/order/detail", {
      params: { order_id: id },
    });

    console.log(res.data);
    if (res.data.length > 0) {
      setModalItem(res.data);
      setModalVis(true);
    } else {
      toast.info("Mesa sem itens");
    }
  }

  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient(undefined);
    await apiClient.put("/order/finish", { order_id: id });

    const res = await apiClient.get("/order");
    setOrders(res.data);

    setModalVis(false);
  }

  async function handleRefreshOrders() {
    setLoading(true);
    const apiClient = setupAPIClient(undefined);
    const res = await apiClient.get("/order");
    setOrders(res.data);
    setLoading(false);
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Painel - Pizzaria</title>
      </Head>
      <div>
        <Header />
        <main className={stl.container}>
          <div className={stl.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button onClick={handleRefreshOrders} className={stl.btnRefresh} disabled={loading}>
              <FiRefreshCcw size={25} color="#3fffa3"></FiRefreshCcw>
            </button>
          </div>
          <article className={stl.listOrders}>
            {orders.length === 0 && (
              <span className={stl.emptyList}>Nenhum pedido em aberto</span>
            )}
            {orders.map((item) => (
              <section className={stl.orderItem} key={item.id}>
                <button
                  onClick={() => handleOpenModalView(item.id)}           
                >
                  <div className={stl.tag}></div>
                  <span>
                    Mesa: <strong>{item.table}</strong>
                  </span>
                </button>
              </section>
            ))}
          </article>
        </main>
        {modalVis && (
          <ModalOrder
            isOpen={modalVis}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={handleFinishItem}
          ></ModalOrder>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(
  async (ctx: GetServerSidePropsContext) => {
    const apiClient = setupAPIClient(ctx);
    const res = await apiClient.get("/order");
    return { props: { OrderList: res.data } };
  }
);
