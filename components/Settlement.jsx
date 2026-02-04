export default function Settlement({ balances, payments, onPay }) {
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([p, a]) => {
    if (a < 0) debtors.push({ p, amt: -a });
    if (a > 0) creditors.push({ p, amt: a });
  });

  const txns = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].amt, creditors[j].amt);

    txns.push({
      from: debtors[i].p,
      to: creditors[j].p,
      remaining: Number(amt.toFixed(2))
    });

    debtors[i].amt -= amt;
    creditors[j].amt -= amt;
    if (!debtors[i].amt) i++;
    if (!creditors[j].amt) j++;
  }

  function settle(t) {
    const input = prompt(
      `Total due ₹${t.remaining}\nHow much are you paying now?`
    );

    const paid = Number(input);
    if (!paid || paid <= 0 || paid > t.remaining) return;

    onPay(t, paid);
  }

  return (
    <div className="card">
      <h2>Settlement</h2>

      {txns.length === 0 && <p>🎉 All settled!</p>}

      {txns.map((t, i) => (
        <div key={i} className="settlement-row">
          <div>
            <b>{t.from}</b> → <b>{t.to}</b>
          </div>
          <div>₹{t.remaining}</div>
          <button onClick={() => settle(t)}>Pay</button>
        </div>
      ))}
    </div>
  );
}
