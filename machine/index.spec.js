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

    describe('LdaUndefined', () => {
      it('loads undefined into accumulator', () => {
        const instructions = [['LdaZero'], ['LdaUndefined']];
        const result = execute(instructions).inspect();

        expect(result).toHaveProperty('registers.accumulator', undefined);
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

    describe('Ldar reg', () => {
      it("loads register's value into accumulator", () => {
        const instructions = [
          ['LdaSmi', [10]],
          ['Star1'],
          ['LdaZero'],
          ['Ldar', 'r1'],
        ];

        const result = execute(instructions).inspect();

        expect(result).toHaveProperty('registers.accumulator', 10);
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

    describe('Jump [addr_const_index]', () => {
      it('unconditionally jumps to the instruction at the address stored in the given const', () => {
        constants = [3]; // instruction address / index
        execute = buildMachine(constants);

        const instructions = [
          ['Jump', [0]],
          ['LdaSmi', [5]],
          ['Star0'],
          ['LdaZero'],
          ['Star1'],
        ];
        const result = execute(instructions).inspect();

        expect(result).not.toHaveProperty(`registers.r0`, 5);
      });
    });

    describe('JumpIfFalse [addr_const_index]', () => {
      it('jumps to the address stored in the given const when flags.boolean is false', () => {
        constants = [7]; // instruction address / index
        execute = buildMachine(constants);

        // prettier-ignore
        const instructions = [
          ['LdaSmi', [5]],             // accumulator := 5
          ['Star0'],                   // r0 := accumulator = 5
          ['LdaZero'],                 // accumulator := 0
          ['TestLessThan', 'r0', [0]], // flags.boolean := r0 < accumulator = 5 < 0 = false
          ['JumpIfFalse', [0]],        // JUMP to instruction at address constants[0] (7)
          ['LdaSmi', [10]],            // [skips] accumulator := 10
          ['Star1'],                   // [skips] r1 := 10
          ['LdaZero'],                 // [jumps here] accumulator := 0
        ];

        const result = execute(instructions).inspect();

        expect(result).not.toHaveProperty(`registers.r1`, 10);
      });

      it('ignores jump to the address stored in the given const when flags.boolean is NOT false', () => {
        constants = [7]; // instruction address / index
        execute = buildMachine(constants);

        // prettier-ignore
        const instructions = [
          ['LdaSmi', [-5]],            // accumulator := -5
          ['Star0'],                   // r0 := accumulator = 5
          ['LdaZero'],                 // accumulator := 0
          ['TestLessThan', 'r0', [0]], // flags.boolean := r0 < accumulator = -5 < 0 = true
          ['JumpIfFalse', [0]],        // [ignores] JUMP to instruction at address constants[0] (7)
          ['LdaSmi', [10]],            // accumulator := 10
          ['Star1'],                   // r1 := 10
          ['LdaZero'],                 // accumulator := 0
        ];

        const result = execute(instructions).inspect();

        expect(result).toHaveProperty(`registers.r1`, 10);
      });
    });

    test.todo('CreateClosure [addr_const_idx] [_] #flag');
    test.todo('CallUndefinedReceiver r0, r2-r4, [0] [addr]');
  });
});
