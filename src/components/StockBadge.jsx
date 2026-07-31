export default function StockBadge({ inStock }) {
  return (
    <span className={inStock ? "stamp-in" : "stamp-out"}>
      {inStock ? "In Stock" : "Sold Out"}
    </span>
  );
}
