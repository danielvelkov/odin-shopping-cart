// format number to US dollar
export const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// format number to British pounds
export const pounds = Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

// format number to Euro
export const euro = Intl.NumberFormat("en-DE", {
  style: "currency",
  currency: "EUR",
});
