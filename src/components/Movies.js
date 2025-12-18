import React, { useEffect, useState, useCallback } from 'react';
import MovieCardSkeleton from './MovieCardSkeleton';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function tmdbGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
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

const MovieCard = React.memo(function MovieCard({ movie }) {
  return (
    <li
      role="listitem"
      aria-label={`${movie.title}, rating ${movie.vote_average?.toFixed(1) ?? 'unrated'}, released ${movie.release_date ?? 'TBD'}`}
      style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}
    >
      <img
        alt={movie.title}
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : ''}
        style={{ width: '100%', display: 'block' }}
      />
      <div style={{ padding: '.5rem .75rem' }}>
        <div style={{ fontWeight: 600 }}>{movie.title}</div>
        <div style={{ fontSize: 12, color: '#555' }}>
          ⭐ {movie.vote_average?.toFixed(1) ?? '—'} · {movie.release_date ?? 'TBD'}
        </div>
      </div>
    </li>
  );
});

export default function Movies() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

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

  const debouncedQ = useDebounce(q, 400);
  useEffect(() => {
    (async () => {
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

  const handleClear = useCallback(() => setQ(''), []);

  return (
    <div style={{ maxWidth: 1024, margin: '2rem auto', padding: '0 1rem' }} aria-busy={loading}>
      <h2 id="movies-heading" style={{ marginBottom: '1rem' }}>Movies</h2>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }} role="search">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies (e.g., 'Dune')"
          aria-label="Search movies"
          role="searchbox"
          style={{ flex: 1, padding: '.5rem .75rem' }}
        />
        <button
          onClick={handleClear}
          disabled={!q}
          style={{ padding: '.5rem .75rem' }}
          aria-label="Clear search"
        >
          Clear
        </button>
      </div>

      {/* States */}
      {err && <p role="alert" style={{ color: 'crimson' }}>{err}</p>}
      {!loading && !err && items.length === 0 && <p role="status">No results found.</p>}

      {/* Grid of posters */}
      <ul
        role="list"
        aria-labelledby="movies-heading"
        aria-live="polite"
        style={{
          display: 'grid',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        }}
      >
        {loading
          ? Array(8).fill().map((_, i) => <MovieCardSkeleton key={i} />)
          : items.map((m) => <MovieCard key={m.id} movie={m} />)}
      </ul>
    </div>
  );
}
