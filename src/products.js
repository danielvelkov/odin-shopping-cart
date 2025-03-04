import { matchSorter } from 'match-sorter';

export async function getProducts(query) {
  let response = await fetch('https://fakestoreapi.com/products');
  if (!response.ok)
    throw new Response('Server error', {
      status: response.status,
      statusText: response.statusText,
    });
  let products = await response.json();
  if (!products) products = [];

  if (query)
    products = matchSorter(products, query, {
      keys: ['title'],
      threshold: matchSorter.rankings.CONTAINS,
    });

  return products;
}

export async function getProduct(id) {
  let response = await fetch('https://fakestoreapi.com/products/' + id);
  if (!response.ok)
    throw new Response('Server error', {
      status: response.status,
      statusText: response.statusText,
    });

  let product = await response.json();
  return product;
}

export async function getProductsByCategory(category, query) {
  let response = await fetch(
    'https://fakestoreapi.com/products/category/' + category
  );
  if (!response.ok)
    throw new Response('Server error', {
      status: response.status,
      statusText: response.statusText,
    });
  let products = await response.json();
  if (!products) products = [];

  if (query)
    products = matchSorter(products, query, {
      keys: ['title'],
      threshold: matchSorter.rankings.CONTAINS,
    });

  return products;
}

// Lets pretend the fakestoreapi has something like this /products?limit=20&offset=100
// but we do it manually with this method
export function getPaginatedProducts(products, pageSize, page) {
  let productsLength = products.length;
  let pages = 1;

  [pageSize, page] = [Number(pageSize), Number(page)];
  pageSize = Math.min(productsLength, pageSize);

  if (Number.isInteger(pageSize) && Number.isInteger(page)) {
    if (pageSize * page > products.length)
      console.error('No such product page list: Page-' + page);

    products = products.filter((e, i) => {
      if (page === 1 && i < pageSize) return e;
      else if (i < pageSize * page && i >= pageSize * (page - 1)) {
        return e;
      }
    });
    pages = Math.ceil(productsLength / pageSize);
  }
  return { products, pages };
}
