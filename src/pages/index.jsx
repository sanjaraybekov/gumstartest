import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api";
import { API_URL } from "../api";
import { formatCurrency } from "../service/formatCurrently";
const tg = window.Telegram.WebApp;

function Categories() {
  const [webapp, setWebapp] = useState();
  const [data, setData] = useState();
  useEffect(() => {
    tg.ready();
    setWebapp(tg);
    async function fetch() {
      await getCategories()
        .then((res) => {
          console.log(res);
          setData(res.categories);
        })
        .catch((error) => {
          alert(error);
        });
    }
    fetch();
  }, []);

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
      <div className="h-full">
        <div className="header flex justify-between items-center px-5 py-2 bg-blue-500 text-white shadow-xl">
          <button
            onClick={() => {
              webapp.close();
              localStorage.removeItem("card");
            }}
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#fff"
                d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
              />
            </svg>
          </button>
          <h1 className="title text-center text-md font-bold my-3 uppercase">
            Kategoriyalar
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

        <div className="container relative h-full">
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-24">
            {data?.map((item) => (
              <div
                className="group relative curson-pointer bg-white p-3 rounded-2xl shadow-xl"
                key={item.id}
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-2xl bg-gray-200 lg:aspect-none lg:h-80">
                  <img
                    src={API_URL + "/files/" + item?.photo}
                    alt="Front of men&#039;s Basic Tee in black."
                    className="h-44 w-full object-cover object-center lg:h-full lg:w-full rounded-2xl"
                  />
                </div>
                <div className="text-center">
                  <div>
                    <h3 className="text-sm text-gray-700 text-center py-2 font-bold">
                      {item?.name}
                    </h3>
                  </div>
                  <div className="flex justify-center">
                    <Link
                      to={`/products/${item.id}`}
                      className="w-full text-sm flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 rounded-xl mt-2"
                    >
                      {" "}
                      Mahsulotlar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;
