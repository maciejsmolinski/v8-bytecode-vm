const { expect } = require('@jest/globals');
const buildMachine = require('./');

describe('Virtual Machine', () => {
  let execute;
  let constants;

  beforeEach(() => {
    constants = ['console', 'log', 'Less than zero', 'Zero or more'];
    execute = buildMachine(constants);
  });

  describe('Initialized', () => {
    it('keeps registers, accumulator and flags uninitialized', () => {
      const instructions = [];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('registers.accumulator', undefined);
      expect(result).toHaveProperty('registers.r1', undefined);
      expect(result).toHaveProperty('registers.r2', undefined);
      expect(result).toHaveProperty('registers.r3', undefined);
      expect(result).toHaveProperty('registers.a1', undefined);
      expect(result).toHaveProperty('registers.a2', undefined);
      expect(result).toHaveProperty('registers.a3', undefined);
      expect(result).toHaveProperty('flags.boolean', undefined);
    });
  });

  describe('Provided basic instructions', () => {
    it('`LdaZero` loads 0 into accumulator', () => {
      const instructions = [['LdaZero']];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('registers.accumulator', 0);
    });

    it('`LdaSmi [x]` loads small int into accumulator', () => {
      const instructions = [['LdaSmi', [6]]];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('registers.accumulator', 6);
    });

    it('`LdaGlobal [name_index] [feedback_slot_index]` loads global[constants[name_index]] into accumulator', () => {
      const instructions = [['LdaGlobal', [0], [1]]];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('registers.accumulator', global.console);
    });

    it('`LdaNamedProperty r [const_index] [y]` loads r[constants[const_index]] into accumulator', () => {
      const instructions = [
        ['LdaGlobal', [0], [1]],
        ['Star1'],
        ['LdaNamedProperty', 'r1', [1], [3]],
      ];

      const result = execute(instructions).inspect();

      expect(result).toHaveProperty(
        'registers.accumulator',
        global.console.log
      );
    });

    it('`LdaConstant [const_index]` loads constants[const_index] into accumulator', () => {
      const instructions = [['LdaConstant', [2]]];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('registers.accumulator', constants[2]);
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
      [true, -6],
      [false, 0],
      [false, 6],
    ])(
      '`TestLessThan [reg] [_]` sets flags.boolean=%s (reg<accumulator) with reg=%s and accumulator=0)',
      (flag, value) => {
        const instructions = [
          ['LdaSmi', [value]],
          ['Star0'],
          ['LdaZero'],
          ['TestLessThan', 'r0', [0]],
        ];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty(`flags.boolean`, flag);
      }
    );

    it('`CallProperty1 r(prop) r(this) r(arg) [x]` calls fn with single value', () => {
      let consoleLogMock = jest
        .spyOn(global.console, 'log')
        .mockImplementation();

      const instructions = [
        // r0 = console
        ['LdaGlobal', [0], [1]],
        ['Star0'],

        // r1 = console.log
        ['LdaNamedProperty', 'r0', [1], [3]],
        ['Star1'],

        // r2 = 'Less than zero'
        ['LdaConstant', [2]],
        ['Star2'],

        // accumulator = console.log.call(console, 'Less than zero')
        ['CallProperty1', 'r1', 'r0', 'r2', [5]],
      ];

      const result = execute(instructions).inspect();

      expect(result).toHaveProperty('registers.accumulator', undefined);
      expect(consoleLogMock).toHaveBeenCalledWith(constants[2]);

      consoleLogMock.mockRestore();
    });

    it('`Return` sets the return value to the value from the accumulator', () => {
      const instructions = [['LdaZero'], ['Return']];
      const result = execute(instructions).inspect();

      expect(result).toHaveProperty(`return`, 0);
    });

    it.todo('`JumpIfFalse [addr]`');
    it.todo('`Ldar a`');
    it.todo('`MulSmi [x] [y]`');
  });
});
