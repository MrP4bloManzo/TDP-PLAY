import { describe, expect, it } from 'vitest';
import { isBlackjack, scoreHand } from '@/lib/casino/cards';

describe('blackjack scoring',()=>{
  it('counts ace as 11 when possible',()=>expect(scoreHand([{rank:'A',suit:'spades'},{rank:'10',suit:'hearts'}])).toBe(21));
  it('reduces ace to one when busting',()=>expect(scoreHand([{rank:'A',suit:'spades'},{rank:'9',suit:'hearts'},{rank:'K',suit:'clubs'}])).toBe(20));
  it('detects blackjack',()=>expect(isBlackjack([{rank:'A',suit:'spades'},{rank:'K',suit:'clubs'}])).toBe(true));
});
