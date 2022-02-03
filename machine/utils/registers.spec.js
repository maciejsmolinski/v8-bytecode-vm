const registers = require('./registers');

describe('registers.range()', () => {
  describe('given single register', () => {
    it('returns singleton array with register name', () => {
      const input = 'r2';
      const expected = ['r2'];

      expect(registers.range(input)).toEqual(expected);
    });
  });

  describe('given register pool with same register name', () => {
    it('returns tuple with same register name', () => {
      const input = 'r2-r2';
      const expected = ['r2', 'r2'];

      expect(registers.range(input)).toEqual(expected);
    });
  });

  describe('given register pool with wider range', () => {
    it('returns N register names', () => {
      const input = 'r2-r5';
      const expected = ['r2', 'r3', 'r4', 'r5'];

      expect(registers.range(input)).toEqual(expected);
    });

    it('returns N register names respecting order', () => {
      const input = 'r4-r2';
      const expected = ['r4', 'r3', 'r2'];

      expect(registers.range(input)).toEqual(expected);
    });
  });

  describe('provided unknown range format', () => {
    it('throws an error', () => {
      const input = 'r2-r2-r2';

      expect(() => registers.range(input)).toThrow();
    });
  });
});
