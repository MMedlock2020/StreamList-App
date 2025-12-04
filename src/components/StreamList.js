// ./components/StreamList.jsx
import React, { useEffect, useState } from 'react';
import styles from './StreamList.module.css';

const STORAGE_KEY = 'streamlist-items';

function StreamList() {
  // --- State ---
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [input, setInput] = useState('');         // new item text
  const [editingId, setEditingId] = useState(null); // which item is being edited
  const [editText, setEditText] = useState('');     // text in the edit field
  const [filter, setFilter] = useState('all');      // 'all' | 'active' | 'completed'

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // --- Actions ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const newItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
    setInput('');
  };

  const toggleComplete = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const startEditing = (id) => {
    const item = items.find(i => i.id === id);
    setEditingId(id);
    setEditText(item?.text ?? '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = () => {
    const text = editText.trim();
    if (!text) return;
    setItems(prev =>
      prev.map(item =>
        item.id === editingId ? { ...item, text } : item
      )
    );
    cancelEditing();
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (editingId === id) cancelEditing();
  };

  const filteredItems = items.filter(i => {
    if (filter === 'active') return !i.completed;
    if (filter === 'completed') return i.completed;
    return true;
  });

  // --- UI ---
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>StreamList</h2>

      {/* Add new item */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a movie or show"
          className={styles.input}
          aria-label="New item text"
        />
        <button type="submit" className={styles.button} disabled={!input.trim()}>
          Submit
        </button>
      </form>

      {/*List */}
      {filteredItems.length === 0 ? (
        <p className={styles.empty}>No items to display</p>
      ) : (
        <ul className={styles.list} aria-live="polite">
          {filteredItems.map(item => (
            <li key={item.id} className={`${styles.row} ${item.completed ? styles.done : ''}`}>
              {/* Complete checkbox 
              <label className={styles.left}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item.id)}
                  aria-label={`Mark "${item.text}" as ${item.completed ? 'active' : 'completed'}`}
                />
              </label> */}

              {/* Text or edit field */}
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
                />
              ) : (
                <span className={styles.text}>{item.text}</span>
              )}

              {/* Actions */}
              <div className={styles.actions}>
                {editingId === item.id ? (
                  <>
                    <button
                      className={styles.actionBtn}
                      onClick={saveEdit}
                      disabled={!editText.trim()}
                    >
                      Save
                    </button>
                    <button className={styles.actionBtn} onClick={cancelEditing}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.actionBtn} onClick={() => startEditing(item.id)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StreamList;
