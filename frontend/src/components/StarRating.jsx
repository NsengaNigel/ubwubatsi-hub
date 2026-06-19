import { useState } from 'react';

const SIZES = { sm: 14, md: 20, lg: 30 };
const GAPS = { sm: 1, md: 2, lg: 4 };

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const px = SIZES[size] ?? SIZES.md;
  const gap = GAPS[size] ?? GAPS.md;
  const active = hovered || value;

  return (
    <div className="flex items-center" style={{ gap }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(n)}
          onMouseEnter={() => !readOnly && setHovered(n)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          aria-label={`Rate ${n} star${n !== 1 ? 's' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: readOnly ? 'default' : 'pointer',
            lineHeight: 1,
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: !readOnly && hovered === n ? 'scale(1.18)' : 'scale(1)',
          }}
        >
          <span
            className={`material-symbols-outlined${n <= active ? ' fill' : ''}`}
            style={{
              fontSize: px,
              color: n <= active ? '#99420d' : '#dcc1b5',
              transition: 'color 0.12s ease',
            }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}
