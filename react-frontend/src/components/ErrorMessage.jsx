//src/components/ErrorMessage.jsx

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
      {message}
    </p>
  );
}
