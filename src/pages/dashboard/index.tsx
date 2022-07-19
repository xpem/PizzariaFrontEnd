import Head from "next/head";
import { Header } from "../../components/ui/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Dasboard() {
  return (
    <>
      <Head>
        <title>Painel - Pizzaria</title>
      </Head>
      <div>
        <Header />
        <h1>Painel</h1>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return { props: {} };
});
