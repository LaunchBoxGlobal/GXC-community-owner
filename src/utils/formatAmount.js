export default function formatAmount(num) {
  //   if (num >= 1e9) return (num / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  //   if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  //   if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
  //   return num.toString();
  return new Intl.NumberFormat("en-US").format(num);
}
