const buildMachine = require('./');

describe('Virtual Machine', () => {
  let execute;
  let constants;

  beforeEach(() => {
    constants = ['console', 'log', 'Less than zero', 'Zero or more'];
    execute = buildMachine(constants);
  });

  describe('Initialized', () => {
    it('keeps registers, accumulators and flags uninitialized', () => {
      const instructions = [];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('accumulators.a0', undefined);
      expect(result).toHaveProperty('registers.r1', undefined);
      expect(result).toHaveProperty('registers.r2', undefined);
      expect(result).toHaveProperty('registers.r3', undefined);
      expect(result).toHaveProperty('flags.boolean', undefined);
    });
  });

  describe('Provided basic instructions', () => {
    it('`LdaZero` loads 0 into accumulator', () => {
      const instructions = [['LdaZero']];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('accumulators.a0', 0);
    });

    it('`LdaGlobal [name_index] [feedback_slot_index]` loads global[constants[name_index]] into accumulator', () => {
      const instructions = [['LdaGlobal', [0], [1]]];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('accumulators.a0', global.console);
    });

    it.each([
      ['Star0', 'r0'],
      ['Star1', 'r1'],
      ['Star2', 'r2'],
    ])("`%s` loads accumulator's value into register %s", (op, reg) => {
      const instructions = [['LdaZero'], [op]];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty(`registers.${reg}`, 0);
    });

    it.each([
      [6, true],
      [0, false],
      [-6, false],
    ])('`TestLessThan a0=0 [%s]` sets boolean flag to %s', (value, flag) => {
      const instructions = [['LdaZero'], ['TestLessThan', 'a0', [value]]];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty(`flags.boolean`, flag);
    });

    it('`Return` sets the return value to the value from the a0', () => {
      const instructions = [['LdaZero'], ['Return']];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty(`return`, 0);
    });

    it.todo('`JumpIfFalse [addr]`');
    it.todo('`LdaNamedProperty r [x] [y]`');
    it.todo('`LdaConstant [x]`');
    it.todo('`Ldar a`');
    it.todo('`MulSmi [x] [y]`');
    it.todo('`CallProperty1 r r r [x]`');
  });
});
