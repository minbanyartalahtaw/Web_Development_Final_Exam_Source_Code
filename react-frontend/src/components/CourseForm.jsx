//src/components/CourseForm.jsx

import { useState } from "react";
import ErrorMessage from "./ErrorMessage";

const empty = {
  name: "",
  duration: "",
  topics: [""],
  price: "",
  maxStudent: "",
  status: "Open",
};

const inputClass = "w-full rounded border px-3 py-2";

// Shared by Create and Edit pages
export default function CourseForm({ initial, submitLabel, onSubmit }) {
  const [form, setForm] = useState(() =>
    initial ? { ...initial, topics: [...initial.topics] } : empty,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setTopic(i, value) {
    setForm((f) => ({
      ...f,
      topics: f.topics.map((t, idx) => (idx === i ? value : t)),
    }));
  }

  function addTopic() {
    setForm((f) => ({ ...f, topics: [...f.topics, ""] }));
  }

  function removeTopic(i) {
    setForm((f) => ({ ...f, topics: f.topics.filter((_, idx) => idx !== i) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        name: form.name,
        duration: Number(form.duration),
        topics: form.topics.map((t) => t.trim()).filter(Boolean),
        price: form.price === "" ? "" : Number(form.price),
        maxStudent: Number(form.maxStudent),
        status: form.status,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-4 rounded-lg border bg-white p-6"
    >
      <ErrorMessage message={error} />

      <div>
        <label className="mb-1 block text-sm">Course name</label>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm">Duration (days)</label>
          <input
            type="number"
            min="1"
            step="1"
            className={inputClass}
            value={form.duration}
            onChange={(e) => setField("duration", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Max Student</label>
          <input
            type="number"
            min="1"
            step="1"
            className={inputClass}
            value={form.maxStudent}
            onChange={(e) => setField("maxStudent", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm">Topics</label>
        <div className="space-y-2">
          {form.topics.map((topic, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                value={topic}
                placeholder={`Topic ${i + 1}`}
                onChange={(e) => setTopic(i, e.target.value)}
              />
              {form.topics.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTopic(i)}
                  className="rounded border px-3 text-sm hover:bg-gray-100"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTopic}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Add topic
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm">Status</label>
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => setField("status", e.target.value)}
        >
          <option value="Open">Open</option>
          <option value="Close">Close</option>
          <option value="Cancel">Cancel</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
