import { useEffect, useState } from "react";
import { getProductsByCategoryId } from "../../api";
import { API_URL } from "../../api";
import { formatCurrency } from "../../service/formatCurrently";
import { Link, useParams } from "react-router-dom";
const tg = window.Telegram.WebApp;

function Products() {
  const [webapp, setWebapp] = useState();
  const [product, setProduct] = useState();
  const [card, setCard] = useState();
  const { id } = useParams();
  useEffect(() => {
    tg.ready();
    setWebapp(tg);
    getProductsByCategoryId(id).then((res) => {
      setProduct(res);
    });
    setCard(JSON.parse(localStorage.getItem("card")));
  }, []);

  function inCard(id) {
    const card = JSON.parse(localStorage.getItem("card"));
    return card?.find((item) => item.id === id);
  }

  function increment(id) {
    const card = JSON.parse(localStorage.getItem("card"));
    if (card) {
      const index = card.findIndex((item) => item.id === id);
      card[index].quantity++;
      localStorage.setItem("card", JSON.stringify(card));
      setProduct({ ...product });
    }
  }

  function decrement(id) {
    const card = JSON.parse(localStorage.getItem("card"));
    if (card) {
      const index = card.findIndex((item) => item.id === id);
      if (card[index].quantity > 1) {
        card[index].quantity--;
        localStorage.setItem("card", JSON.stringify(card));
        setProduct({ ...product });
      } else if (card[index].quantity === 1) {
        card.splice(index, 1);
        localStorage.setItem("card", JSON.stringify(card));
        setProduct({ ...product });
      }
    }
  }

  function addToCard(item) {
    const card = JSON.parse(localStorage.getItem("card"));
    if (card) {
      const index = card.findIndex((i) => i.id === item.id);
      if (index === -1) {
        card.push({
          ...item,
          quantity: 1,
          category_name: product?.category?.name,
        });
      } else {
        card[index].quantity++;
      }
      localStorage.setItem("card", JSON.stringify(card));
    } else {
      localStorage.setItem(
        "card",
        JSON.stringify([
          { ...item, quantity: 1, category_name: product?.category?.name },
        ])
      );
    }
    setProduct({ ...product });
  }

  function productQuantity(id) {
    const card = JSON.parse(localStorage.getItem("card"));
    if (card) {
      const index = card.findIndex((item) => item.id === id);
      return card[index].quantity;
    }
    return 0;
  }

  function totalProductQuantity() {
    const card = JSON.parse(localStorage.getItem("card"));
    if (card) {
      return card.reduce((acc, item) => acc + item.quantity, 0);
    } else {
      return 0;
    }
  }

  return (
    <>
      <div className="">
        <div className="header flex justify-between items-center px-5 py-2 bg-blue-500 text-white shadow-xl">
          <Link to="/">
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z"
                fill="#fff"
              />
            </svg>
          </Link>
          <h1 className="title text-center text-md font-bold my-3 uppercase">
            {product?.category?.name}
          </h1>
          <div className="relative">
            <Link to="/card">
              <svg
                fill="#fff"
                width="25px"
                height="25px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8,3V7H21l-2,7H8v2H18a1,1,0,0,1,0,2H7a1,1,0,0,1-1-1V4H4A1,1,0,0,1,4,2H7A1,1,0,0,1,8,3ZM6,20.5A1.5,1.5,0,1,0,7.5,19,1.5,1.5,0,0,0,6,20.5Zm9,0A1.5,1.5,0,1,0,16.5,19,1.5,1.5,0,0,0,15,20.5Z" />
              </svg>
              <span className="absolute top-4 left-4 bg-white text-blue-500 w-4 h-4 flex justify-center items-center rounded-full text-xs font-bold">
                {totalProductQuantity() > 0 && totalProductQuantity()}
              </span>
            </Link>
          </div>
        </div>

        <div className="container relative">
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-24">
            {product?.items?.map(
              (item) =>
                item.status === "active" && (
                  <div
                    className="group relative curson-pointer bg-white p-3 rounded-2xl shadow-xl"
                    key={item.id}
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-2xl bg-gray-200 lg:aspect-none lg:h-80">
                      <img
                        src={API_URL + "/files/" + item?.photo}
                        alt="Front of men&#039;s Basic Tee in black."
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full rounded-2xl"
                      />
                    </div>
                    <div className="text-center">
                      <div>
                        <h3 className="text-sm text-gray-700 text-center py-2 font-bold">
                          {item?.name}
                        </h3>
                      </div>
                      <p className="border-gray-200 text-sm">
                        {formatCurrency(parseInt(item?.price))}
                      </p>

                      {!inCard(item?.id) ? (
                        <div className="flex justify-center">
                          <button
                            className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white py-3 px-1 rounded-3xl mt-2"
                            onClick={() => addToCard(item)}
                          >
                            <svg
                              fill="#fff"
                              width="15px"
                              height="15px"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8,3V7H21l-2,7H8v2H18a1,1,0,0,1,0,2H7a1,1,0,0,1-1-1V4H4A1,1,0,0,1,4,2H7A1,1,0,0,1,8,3ZM6,20.5A1.5,1.5,0,1,0,7.5,19,1.5,1.5,0,0,0,6,20.5Zm9,0A1.5,1.5,0,1,0,16.5,19,1.5,1.5,0,0,0,15,20.5Z" />
                            </svg>
                            <span className="text-xs ml-1">
                              Savatga qo&apos;shish
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center mt-2">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white rounded-3xl px-4 py-2">
                            <span
                              className="text-xl font-bold leading-none"
                              onClick={() => decrement(item?.id)}
                            >
                              <svg
                                width="20px"
                                height="20px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                                  fill="#fff"
                                />
                              </svg>
                            </span>
                          </button>

                          <span className="px-5">
                            {productQuantity(item?.id)}
                          </span>

                          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-3xl">
                            <span
                              className="text-xl font-bold leading-3"
                              onClick={() => increment(item?.id)}
                            >
                              <svg
                                width="20px"
                                height="20px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
                                  fill="#fff"
                                />
                              </svg>
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>

          <div className="checkout">
            <Link
              to="/card"
              className="fixed bottom-0 left-0 bg-blue-500 w-full p-4 text-md font-bold text-white text-center"
            >
              Buyurtma berish
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
