export function formatCurrency(number, currency = "UZS") {
  if (!number) {
    number = 0;
  }
  return number.toLocaleString("ru", {
    style: "currency",
    currency: currency,
    maximumSignificantDigits: 10,
  });
}
