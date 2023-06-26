// based on https://github.com/vercel/swr/blob/main/examples/basic/libs/fetch.js
export default async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}
