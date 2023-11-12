import axios from "axios";

// export const API_URL = "https://alif.noorgroup.uz";
export const API_URL = "http://localhost:8000";

export const getProducts = () =>
  axios.get(`${API_URL}/product/public`).then((res) => res.data);

export const getProductsByCategoryId = (id) =>
  axios.get(`${API_URL}/product/${id}`).then((res) => res.data);

export const getCategories = () =>
  axios.get(`${API_URL}/category/public`).then((res) => res.data);

export const createOrder = (data) =>
  axios.post(`${API_URL}/order`, data).then((res) => res.data);

export const orderBotPost = (id, chat_id) =>
  axios
    .post(`${API_URL}/bot/order`, {
      message: "Salom",
      queryId: id,
      chat_id,
    })
    .then((res) => res.data);

export const getUserData = (chat_id) =>
  axios.get(`${API_URL}/user/${chat_id}`).then((res) => res.data);
