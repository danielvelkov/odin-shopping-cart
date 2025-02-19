export async function getCategories() {
  let response = await fetch("https://fakestoreapi.com/products/categories");
  if (!response.ok)
    throw new Response("Server error", {
      status: response.status,
      statusText: response.statusText,
    });
  let categories = await response.json();
  if (!categories) categories = [];

  return categories;
}
