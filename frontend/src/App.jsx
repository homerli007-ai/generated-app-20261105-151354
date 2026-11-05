import { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const paths = input.split('\n').map(s => s.trim()).filter(Boolean);
    if (paths.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ deleted: [], errors: [{ path: '*', error: String(e) }] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Safe File Deleter</h1>
      <p className="hint">Enter one relative file path per line (relative to allowed root).</p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="e.g.\nnotes.txt\nsubdir/report.pdf"
        rows={8}
      />
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Files'}
      </button>
      {result && (
        <div className="result">
          <h2>Deleted ({result.deleted.length})</h2>
          <ul>{result.deleted.map(p => <li key={p} className="ok">{p}</li>)}</ul>
          <h2>Errors ({result.errors.length})</h2>
          <ul>
            {result.errors.map((e, i) => (
              <li key={i} className="err"><b>{e.path}</b>: {e.error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
