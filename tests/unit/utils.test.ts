import { describe, expect, it } from 'vitest';
import { formatCoins, slugify } from '@/lib/utils';

describe('utils',()=>{it('formats coins',()=>expect(formatCoins(10000)).toBe('10,000'));it('slugifies accents',()=>expect(slugify('Fútbol del Valle')).toBe('futbol-del-valle'));});
