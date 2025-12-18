// ./components/StreamList.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './StreamList.module.css';
import StreamItemSkeleton from './StreamItemSkeleton';

const STORAGE_KEY = 'streamlist-items';

// Memoized row component
const StreamItem = React.memo(function StreamItem({
  item,
  editingId,
  editText,
  toggleComplete,
  startEditing,
  cancelEditing,
  saveEdit,
  setEditText,
  deleteItem,
}) {
  return (
    <li
      role="listitem"
      aria-label={`Item: ${item.text}, status: ${item.completed ? 'completed' : 'active'}`}
      className={`${styles.row} ${item.completed ? styles.done : ''}`}
    >
      {editingId === item.id ? (
        <input
          className={styles.editInput}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEditing();
          }}
          autoFocus
          aria-label="Edit item text"
        />
      ) : (
        <span className={styles.text}>{item.text}</span>
      )}

      <div className={styles.actions}>
        {editingId === item.id ? (
          <>
            <button
              className={styles.actionBtn}
              onClick={saveEdit}
              disabled={!editText.trim()}
              aria-label="Save changes"
            >
              Save
            </button>
            <button
              className={styles.actionBtn}
              onClick={cancelEditing}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.actionBtn}
              onClick={() => startEditing(item.id)}
              aria-label={`Edit ${item.text}`}
            >
              Edit
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => deleteItem(item.id)}
              aria-label={`Delete ${item.text}`}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
});

function StreamList() {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const newItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    setInput('');
  }, [input]);

  const toggleComplete = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const startEditing = useCallback((id) => {
    const item = items.find((i) => i.id === id);
    setEditingId(id);
    setEditText(item?.text ?? '');
  }, [items]);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditText('');
  }, []);

  const saveEdit = useCallback(() => {
    const text = editText.trim();
    if (!text) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, text } : item
      )
    );
    cancelEditing();
  }, [editText, editingId, cancelEditing]);

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) cancelEditing();
  }, [editingId, cancelEditing]);

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      if (filter === 'active') return !i.completed;
      if (filter === 'completed') return i.completed;
      return true;
    });
  }, [items, filter]);

  return (
    <div className={styles.container} aria-busy={loading}>
      <h2 id="streamlist-heading" className={styles.title}>StreamList</h2>

      <form onSubmit={handleSubmit} className={styles.form} aria-labelledby="streamlist-heading">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a movie or show"
          className={styles.input}
          aria-label="New item text"
        />
        <button type="submit" className={styles.button} disabled={!input.trim()} aria-label="Add new item">
          Submit
        </button>
      </form>

      {loading ? (
        <ul role="list" aria-busy="true" aria-live="polite">
          {Array(4).fill().map((_, i) => <StreamItemSkeleton key={i} />)}
        </ul>
      ) : filteredItems.length === 0 ? (
        <p role="status" className={styles.empty}>No items to display</p>
      ) : (
        <ul role="list" aria-live="polite" aria-labelledby="streamlist-heading" className={styles.list}>
          {filteredItems.map((item) => (
            <StreamItem
              key={item.id}
              item={item}
              editingId={editingId}
              editText={editText}
              toggleComplete={toggleComplete}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEdit={saveEdit}
              setEditText={setEditText}
              deleteItem={deleteItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default StreamList;
