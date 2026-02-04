import { useState, useEffect } from "react";

export default function AddExpense({ members, onAdd, editingExpense, onUpdate }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setPayer(editingExpense.payer);
      setParticipants(editingExpense.participants);
    }
  }, [editingExpense]);

  function toggle(name) {
    setParticipants(p =>
      p.includes(name) ? p.filter(x => x !== name) : [...p, name]
    );
  }

  function submit(e) {
    e.preventDefault();

    const data = {
      id: editingExpense ? editingExpense.id : crypto.randomUUID(),
      title,
      amount: Number(amount),
      payer,
      participants
    };

    editingExpense ? onUpdate(data) : onAdd(data);

    setTitle("");
    setAmount("");
    setPayer("");
    setParticipants([]);
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />

      <select value={payer} onChange={e => setPayer(e.target.value)}>
        <option value="">Paid by</option>
        {members.map(m => <option key={m}>{m}</option>)}
      </select>

      <div className="participants">
        {members.map(m => (
          <label key={m} className="participant">
            <input
              type="checkbox"
              checked={participants.includes(m)}
              onChange={() => toggle(m)}
            />
            <span>{m}</span>
          </label>
        ))}
      </div>


      <button>{editingExpense ? "Update" : "Add"} Expense</button>
    </form>
  );
}
