import type { ReactElement } from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
}

export function HighlightText({
  text,
  query,
}: HighlightTextProps): ReactElement {
  const trimmedQuery = query.trim();

  if (trimmedQuery === '') {
    return <>{text}</>;
  }

  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmedQuery.toLowerCase() ? (
          <mark key={`${part}-${index}`} className="highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
