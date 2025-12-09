import React, { useEffect, useState } from 'react';

// Read the API key from env
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';

// Small helper to call TMDB with api_key in the query string
async function tmdbGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY);

  // append any extra query params
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TMDB ${res.status}: ${text || 'Request failed'}`);
  }
  return res.json();
}


function useDebounce(value, delay = 400) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setD(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return d;
}

export default function Movies() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Load "Popular" on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const data = await tmdbGet('/movie/popular', { language: 'en-US', page: 1 });
        setItems(data.results || []);
      } catch (e) {
        setErr(e.message || 'Failed to load popular movies');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Search (debounced)
  const debouncedQ = useDebounce(q, 400);
  useEffect(() => {
    (async () => {
      // If the field is empty, reload "Popular"
      if (!debouncedQ.trim()) {
        setLoading(true);
        setErr('');
        try {
          const data = await tmdbGet('/movie/popular', { language: 'en-US', page: 1 });
          setItems(data.results || []);
        } catch (e) {
          setErr(e.message || 'Failed to load popular movies');
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setErr('');
      try {
        const data = await tmdbGet('/search/movie', {
          query: debouncedQ,
          include_adult: false,
          language: 'en-US',
          page: 1,
        });
        setItems(data.results || []);
      } catch (e) {
        setErr(e.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQ]);

  return (
    <div style={{ maxWidth: 1024, margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Movies</h2>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies (e.g., 'Dune')"
          aria-label="Search movies"
          style={{ flex: 1, padding: '.5rem .75rem' }}
        />
        <button
          onClick={() => setQ('')}
          disabled={!q}
          style={{ padding: '.5rem .75rem' }}
        >
          Clear
        </button>
      </div>

      {/* States */}
      {loading && <p>Loading…</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      {!loading && !err && items.length === 0 && <p>No results found.</p>}

      {/* Grid of posters */}
      <ul
        style={{
          display: 'grid',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        }}
        aria-live="polite"
      >
        {items.map((m) => (
          <li key={m.id} style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
            <img
              alt={m.title}
              // TMDB image CDN: https://image.tmdb.org/t/p/{size}{path}
              // w342 is a good poster size; you can change to w500 or original as needed
              src={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : ''}
              style={{ width: '100%', display: 'block' }}
            />
            <div style={{ padding: '.5rem .75rem' }}>
              <div style={{ fontWeight: 600 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: '#555' }}>
                ⭐ {m.vote_average?.toFixed(1) ?? '—'} · {m.release_date ?? 'TBD'}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
