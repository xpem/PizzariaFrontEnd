import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { Header } from "../../components/ui/Header";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import stl from "./styles.module.scss";

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

export default function Dasboard({ OrderList }: OrderProps) {
  const [orders, setOrders] = useState(OrderList || []);

function handleOpenModalView(id: string){

}


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
            <button>
              <FiRefreshCcw size={25} color="#3fffa3"></FiRefreshCcw>
            </button>
          </div>
          <article className={stl.listOrders}>
            {OrderList.map((item) => (
              <section className={stl.orderItem} key={item.id}>
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={stl.tag}></div>
                  <span>Mesa {item.table}</span>
                </button>
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

    const res = await apiClient.get("/order");

    return { props: { OrderList: res.data } };
  }
);
