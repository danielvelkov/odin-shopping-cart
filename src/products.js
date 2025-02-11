import { matchSorter } from "match-sorter";

export async function getProducts(query) {
  let response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok)
    throw new Response("Server error", {
      status: response.status,
      statusText: response.statusText,
    });
  let products = await response.json();
  if (!products) products = [];

  if (query)
    products = matchSorter(products, query, { keys: ["title", "description"] });

  return products;
}

export async function getProduct(id) {
  let response = await fetch("https://fakestoreapi.com/products/" + id);
  if (!response.ok)
    throw new Response("Server error", {
      status: response.status,
      statusText: response.statusText,
    });

  let product = await response.json();
  return product;
}
