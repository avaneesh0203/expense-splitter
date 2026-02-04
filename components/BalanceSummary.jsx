export default function BalanceSummary({ balances }) {
  const entries = Object.entries(balances).filter(
    ([, amt]) => Math.abs(amt) > 1
  );

  return (
    <div className="card">
      <h2>Balance Summary</h2>

      {entries.length === 0 && <p>🎉 Everyone is settled!</p>}

      {entries.map(([name, amt]) => (
        <p
          key={name}
          className={amt > 0 ? "balance-positive" : "balance-negative"}
        >
          {name}{" "}
          {amt > 0
            ? `gets ₹${amt.toFixed(2)}`
            : `owes ₹${(-amt).toFixed(2)}`}
        </p>
      ))}
    </div>
  );
}
