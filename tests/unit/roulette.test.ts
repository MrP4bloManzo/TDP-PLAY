import { describe, expect, it } from 'vitest';
import { resolveRoulette } from '@/lib/casino/roulette';

describe('roulette',()=>{
  it('pays red on a red number',()=>expect(resolveRoulette('red','red',19)).toBe(1));
  it('does not pay red on zero',()=>expect(resolveRoulette('red','red',0)).toBe(0));
  it('pays exact number 35x total multiplier path',()=>expect(resolveRoulette('number','7',7)).toBe(35));
  it('pays dozens 2 profit multiplier',()=>expect(resolveRoulette('dozen','2',20)).toBe(2));
});
