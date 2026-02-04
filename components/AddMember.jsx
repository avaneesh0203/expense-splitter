import { useState } from "react";

export default function AddMember({ onAdd }) {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add Member</h2>
      <input
        placeholder="Member name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
