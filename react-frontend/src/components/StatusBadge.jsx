//src/components/StatusBadge.jsx

const colors = {
  Open: "bg-green-100 text-green-700",
  Close: "bg-yellow-100 text-yellow-800",
  Cancel: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${colors[status] ?? ""}`}>
      {status}
    </span>
  );
}
