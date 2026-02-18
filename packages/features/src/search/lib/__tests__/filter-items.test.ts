/**
 * filterSearchItems unit tests. Verifies substring matching and empty query behavior.
 */
import { filterSearchItems } from '../filter-items';
import type { SearchItem } from '../../types';

const mockItems: SearchItem[] = [
  {
    id: '1',
    title: 'Haircuts & Styling',
    description: 'Precision cuts for all.',
    href: '/services/haircuts',
    type: 'Page',
    tags: ['haircuts', 'styling'],
  },
  {
    id: '2',
    title: 'Coloring Services',
    description: 'Full color and highlights.',
    href: '/services/coloring',
    type: 'Page',
    tags: ['coloring'],
  },
  {
    id: 'blog-1',
    title: 'Summer Hair Tips',
    description: 'Keep your hair healthy in summer.',
    href: '/blog/summer-hair-tips',
    type: 'Blog',
    tags: ['blog', 'tips'],
  },
];

describe('filterSearchItems', () => {
  it('returns first N items when query is empty', () => {
    const result = filterSearchItems(mockItems, '', 2);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('matches by title (case-insensitive)', () => {
    const result = filterSearchItems(mockItems, 'haircuts');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Haircuts & Styling');
  });

  it('matches by description (substring)', () => {
    const result = filterSearchItems(mockItems, 'highlights');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Coloring Services');
  });

  it('matches by tags', () => {
    const result = filterSearchItems(mockItems, 'tips');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Summer Hair Tips');
  });

  it('returns empty when no match', () => {
    const result = filterSearchItems(mockItems, 'xyz-nonexistent');
    expect(result).toHaveLength(0);
  });

  it('trims and lowercases query', () => {
    const result = filterSearchItems(mockItems, '  COLORING  ');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Coloring Services');
  });
});
