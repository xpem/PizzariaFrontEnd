import Head from "next/head";
import { Header } from "../../../components/ui/Header";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import stl from "../form.module.scss";
import { FiUpload } from "react-icons/fi";
import { ChangeEvent, FormEvent, useState } from "react";
import { api } from "../../../services/apiClient";
import { setupAPIClient } from "../../../services/api";
import { GetServerSidePropsContext } from "next";
import { toast } from "react-toastify";
import CurrencyInput from "react-currency-input-field";
import Router from "next/router";
import { Value } from "sass";

type ItemProps = {
  id: string;
  name: string;
};

interface ProductInfosProps {
  categoryList: ItemProps[];
  productInfo: ProductProps;
}

type ProductProps = {
  id: string;
  price: string;
  description: string;
  name: string;
  category_id: string;
};

export default function Product({
  categoryList,
  productInfo,
}: ProductInfosProps) {
  const [name, setName] = useState(productInfo?.name || "");
  const [price, setPrice] = useState(productInfo?.price || "");
  const [description, setDescription] = useState(
    productInfo?.description || ""
  );
  // const [avatarURL, setAvatarURL] = useState("");
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(
    productInfo?.category_id || ""
  );
  const [product, setProduct] = useState(productInfo || null);

  console.log(price);
  function handleChangeCategory(e: any) {
    setCategorySelected(e.target.value);
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();
      let priceValue = price.replace("R$ ", "");

      console.log(priceValue);
      console.log(categorySelected);
      if (name === "" || price === "") {
        toast.error("Preencha todos os campos");
        return;
      }

      data.append("name", name);
      data.append("price", priceValue);
      data.append("description", description);
      data.append("category_id", categorySelected);

      // data.append("file", imageAvatar);

      const apiClient = setupAPIClient(undefined);
      console.log(data);
      await apiClient.put("/product/" + product.id, {
        name,
        price: priceValue,
        description,
        category_id: categorySelected,
      });

      toast.success("Produto Atualizado com sucesso");
      Router.push("/product/list");
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao cadastrar o produto");
    }

    setName("");
    setPrice("");
    setDescription("");
    // setImageAvatar(null);
    // setAvatarURL("");
    setCategorySelected("");
  }

  return (
    <>
      <Head>
        <title>Atualizar Produto - Pizzaria</title>
      </Head>
      <div>
        <Header />
        <main className={stl.container}>
          <h1>Atualizar Produto</h1>
          <hr style={{ color: "var(--white)" }} />
          <form className={stl.form} onSubmit={handleRegister}>
            <select value={categorySelected} onChange={handleChangeCategory}>
              {categories.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <input
              className={stl.input}
              type="text"
              placeholder="Digite o nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <CurrencyInput
              name="input-name"
              value={price}
              className={stl.input}
              placeholder="Digite o preço do produto"
              decimalsLimit={2}
              maxLength={6}
              prefix="R$ "
              decimalSeparator=","
              groupSeparator="."
              onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
              className={stl.input}
              placeholder="Descreva o produto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button className={stl.buttonAdd} type="submit">
              Atualizar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  let product: any;

  if (ctx.query?.id) {
    product = await apiClient.get("/product/" + ctx.query.id);
    console.log(product.data[0]);
  }

  const res = await apiClient.get("/category");
  // console.log(res.data);
  return { props: { categoryList: res.data, productInfo: product.data[0] } };
});
