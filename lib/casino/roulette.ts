export const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export function resolveRoulette(selectionType: string, selectionValue: string, winningNumber: number) {
  const isRed = RED_NUMBERS.has(winningNumber);
  const color = winningNumber === 0 ? 'green' : isRed ? 'red' : 'black';
  if (selectionType === 'number') return winningNumber === Number(selectionValue) ? 35 : 0;
  if (selectionType === 'red') return color === 'red' ? 1 : 0;
  if (selectionType === 'black') return color === 'black' ? 1 : 0;
  if (selectionType === 'even') return winningNumber !== 0 && winningNumber % 2 === 0 ? 1 : 0;
  if (selectionType === 'odd') return winningNumber % 2 === 1 ? 1 : 0;
  if (selectionType === 'low') return winningNumber >= 1 && winningNumber <= 18 ? 1 : 0;
  if (selectionType === 'high') return winningNumber >= 19 && winningNumber <= 36 ? 1 : 0;
  if (selectionType === 'dozen') {
    const d = Number(selectionValue);
    return winningNumber > (d - 1) * 12 && winningNumber <= d * 12 ? 2 : 0;
  }
  if (selectionType === 'column') {
    const column = Number(selectionValue);
    return winningNumber !== 0 && ((winningNumber - 1) % 3) + 1 === column ? 2 : 0;
  }
  return 0;
}
