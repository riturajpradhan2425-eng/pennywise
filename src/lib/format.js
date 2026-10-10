export const inr = (n, symbol = "₹") => `${symbol}${Number(n || 0).toLocaleString("en-IN")}`;
export const formatMoney = (n, symbol = "₹") => `${symbol}${Number(n || 0).toLocaleString("en-IN")}`;
