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
    describe('LdaZero', () => {
      it('loads 0 into accumulator', () => {
        const instructions = [['LdaZero']];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty('registers.accumulator', 0);
      });
    });

    describe('LdaSmi [imm]', () => {
      it('loads small int into accumulator', () => {
        const instructions = [['LdaSmi', [6]]];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty('registers.accumulator', 6);
      });
    });

    describe('LdaGlobal [name_index] [feedback_slot_index]', () => {
      it('loads global[constants[name_index]] into accumulator', () => {
        const instructions = [['LdaGlobal', [0], [1]]];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty('registers.accumulator', global.console);
      });
    });

    describe('LdaNamedProperty reg [const_index [_]', () => {
      it('`loads reg[constants[const_index]] into accumulator', () => {
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
    });

    describe('LdaConstant [const_index]', () => {
      it('loads constants[const_index] into accumulator', () => {
        const instructions = [['LdaConstant', [2]]];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty('registers.accumulator', constants[2]);
      });
    });

    describe.each([
      ['Star0', 'r0'],
      ['Star1', 'r1'],
      ['Star2', 'r2'],
    ])('%s', (instruction, register) => {
      it(`loads accumulator's value into register ${register}`, () => {
        const instructions = [['LdaZero'], [instruction]];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty(`registers.${register}`, 0);
      });
    });

    describe('MulSmi [imm] [_]', () => {
      it('multiplies value in the accumulator by small int', () => {
        const instructions = [
          ['LdaSmi', [6]],
          ['MulSmi', [5], [0]],
        ];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty('registers.accumulator', 30);
      });
    });

    describe('TestLessThan reg [_]', () => {
      it.each([
        [true, -6, 'lower than'],
        [false, 0, 'equal to'],
        [false, 6, 'bigger than'],
      ])(
        "sets flags.boolean to %s when register's value (%s) is %s accumulator's value (0)",
        (flag, value, _) => {
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
    });

    describe('CallProperty1 reg(prop) reg(obj) reg(arg) [_]', () => {
      it('`calls obj[prop](arg) with single value', () => {
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
    });

    describe('Return', () => {
      it('sets the return value to the value of the accumulator', () => {
        const instructions = [['LdaZero'], ['Return']];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty(`return`, 0);
      });
    });

    test.todo('`JumpIfFalse [addr]`');
    test.todo('`Ldar a`');
  });
});
