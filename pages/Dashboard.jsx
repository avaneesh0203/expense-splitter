import { useEffect, useState } from "react";

import AddMember from "../components/AddMember";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import BalanceSummary from "../components/BalanceSummary";
import Settlement from "../components/Settlement";

export default function Dashboard() {
  /* ================= STATE ================= */

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem("groups");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeGroupId, setActiveGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  // 🔥 Settlement ledger (supports partial payments)
  const [payments, setPayments] = useState([]);
  const [lastPayment, setLastPayment] = useState(null);

  /* ================= EFFECT ================= */

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  const activeGroup = groups.find(g => g.id === activeGroupId);

  /* ================= GROUP ================= */

  function addGroup() {
    if (!groupName.trim()) return;

    const group = {
      id: crypto.randomUUID(),
      name: groupName.trim(),
      members: [],
      expenses: []
    };

    setGroups([...groups, group]);
    setActiveGroupId(group.id);
    setPayments([]);
    setGroupName("");
  }

  function deleteGroup() {
    setGroups(groups.filter(g => g.id !== activeGroupId));
    setActiveGroupId(null);
    setEditingExpense(null);
    setPayments([]);
  }

  function renameGroup(name) {
    if (!name) return;
    setGroups(groups.map(g =>
      g.id === activeGroupId ? { ...g, name } : g
    ));
  }

  /* ================= MEMBERS ================= */

  function addMember(name) {
    setGroups(groups.map(g =>
      g.id === activeGroupId
        ? {
            ...g,
            members: g.members.includes(name)
              ? g.members
              : [...g.members, name]
          }
        : g
    ));
  }

  /* ================= EXPENSES ================= */

  function addExpense(expense) {
    setGroups(groups.map(g =>
      g.id === activeGroupId
        ? { ...g, expenses: [expense, ...g.expenses] }
        : g
    ));
    setPayments([]);
  }

  /* ================= BALANCE ================= */

  const balances = activeGroup
    ? activeGroup.members.reduce((a, m) => ({ ...a, [m]: 0 }), {})
    : {};

  if (activeGroup) {
    activeGroup.expenses.forEach(({ payer, amount, participants }) => {
      const share = amount / participants.length;
      participants.forEach(p => {
        p === payer
          ? balances[p] += amount - share
          : balances[p] -= share;
      });
    });
  }

  // Apply partial payments
  payments.forEach(p => {
    balances[p.from] += p.paid;
    balances[p.to] -= p.paid;
  });

  /* ================= PAYMENT HANDLING ================= */

  function handlePayment(txn, paid) {
    const payment = {
      ...txn,
      paid
    };

    setPayments([...payments, payment]);
    setLastPayment(payment);

    setTimeout(() => setLastPayment(null), 5000);
  }

  function undoPayment() {
    setPayments(payments.filter(p => p !== lastPayment));
    setLastPayment(null);
  }

  /* ================= UI ================= */

  return (
    <>
      <div className="card">
        <h2>👥 Groups</h2>

        <input
          placeholder="Group name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addGroup()}
        />

        <button onClick={addGroup} style={{ marginTop: 10 }}>
          ➕ Create Group
        </button>

        <div className="group-list">
          {groups.map(g => (
            <button
              key={g.id}
              className={g.id === activeGroupId ? "active" : ""}
              onClick={() => {
                setActiveGroupId(g.id);
                setPayments([]);
              }}
            >
              {g.name}
            </button>
          ))}
        </div>

        {activeGroup && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="secondary"
              onClick={() => {
                const name = prompt("New group name", activeGroup.name);
                if (name) renameGroup(name);
              }}
            >
              ✏️ Rename
            </button>
            <button className="danger" onClick={deleteGroup}>
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {!activeGroup && <p style={{ textAlign: "center" }}>Select a group</p>}

      {activeGroup && (
        <>
          <AddMember onAdd={addMember} />
          <AddExpense
            members={activeGroup.members}
            onAdd={addExpense}
            editingExpense={editingExpense}
          />
          <ExpenseList expenses={activeGroup.expenses} />
          <BalanceSummary balances={balances} />
          <Settlement
            balances={balances}
            payments={payments}
            onPay={handlePayment}
          />
        </>
      )}

      {lastPayment && (
        <div className="toast">
          Payment of ₹{lastPayment.paid} recorded
          <button onClick={undoPayment}>UNDO</button>
        </div>
      )}
    </>
  );
}
