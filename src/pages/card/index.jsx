import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, orderBotPost } from "../../api";
import { formatCurrency } from "../../service/formatCurrently";
const tg = window.Telegram.WebApp;

export default function index() {
  const [order, setOrder] = useState();

  useEffect(() => {
    tg.ready();
    setOrder(JSON.parse(localStorage.getItem("card")));
  }, []);

  const navigate = useNavigate();

  function deleteOrder(id) {
    const order = JSON.parse(localStorage.getItem("card"));
    const index = order.findIndex((item) => item.id === id);
    order.splice(index, 1);
    localStorage.setItem("card", JSON.stringify(order));
    setOrder([...order]);
  }

  async function onFinish() {
    
    const data = {
      order_item: order,
      chat_id: 788109879,
      order_type: "simple",
    };

    await createOrder(data)
      .then((res) => {
        if (res) {
          localStorage.removeItem("card");
          tg?.close();
        }
      })
      .catch((err) => {
        alert("Xatolik yuz berdi");
      });
  }

  return (
    <div>
      <div className="header flex justify-between items-center px-5 py-3 bg-blue-500 text-white shadow-xl">
        <button onClick={() => navigate(-1)}>
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
        </button>
        <h2 className="title text-center text-md font-bold py-2">
          Buyurtmalarim
        </h2>
        <div className="relative w-5 h-5"></div>
      </div>

      <div className="mx-5">
        <table className="min-w-full bg-white border border-gray-200 text-xs mt-7">
          <thead className="text-start">
            <tr>
              <th className="py-2 px-4 border-b">Nomi</th>
              <th className="py-2 px-4 border-b">Soni</th>
              <th className="py-2 px-4 border-b">Narxi</th>
              <th className="py-2 px-4 border-b"> O'chirish</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {order?.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{item?.name}</td>
                <td className="py-2 px-4 border-b">{item.quantity}</td>
                <td className="py-2 px-4 border-b">
                  {formatCurrency(parseInt(item.price))}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-red-500 text-white px-2 py-2 rounded-full"
                    onClick={() => deleteOrder(item?.id)}
                  >
                    <svg
                      width="15px"
                      height="15px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 12V17"
                        stroke="#fff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 12V17"
                        stroke="#fff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4 7H20"
                        stroke="#fff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                        stroke="#fff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                        stroke="#fff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-5">
          <h2 className="text-md font-bold">Umumiy narx</h2>
          <h2 className="text-md font-bold">
            {formatCurrency(
              order?.reduce(
                (acc, item) => acc + item.quantity * parseInt(item.price),
                0
              )
            )}
          </h2>
        </div>
      </div>

      {order?.length > 0 && (
        <div className="checkout">
          <button
            onClick={() => onFinish()}
            className="fixed bottom-0 left-0 bg-blue-500 w-full p-4 text-md font-bold text-white text-center"
          >
            Buyurtmani tasdiqlash
          </button>
        </div>
      )}
    </div>
  );
}
