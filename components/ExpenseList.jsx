export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses.length) return null;

  return (
    <div className="card">
      <h2>Expenses</h2>
      {expenses.map(e => (
        <div className="row">
          <span> {e.title} — ₹{e.amount} ({e.payer})</span>
          <div>
            <button onClick={() => onEdit(e)}>✏️</button>
            <button className="danger" onClick={() => onDelete(e.id)}>🗑️</button>
          </div>
        </div>

      ))}
    </div>
  );
}
