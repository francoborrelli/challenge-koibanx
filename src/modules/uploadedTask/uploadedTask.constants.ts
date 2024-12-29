import type { MappingTypes } from './uploadedTask.interfaces';

export const AVAILABLE_FORTATTERS: Record<number, Record<string, MappingTypes>> = {
  0: { name: 'String', age: 'Number', nums: 'Array<Number>' },
  1: { name: 'Number', age: 'String', 'nums?': 'Array<Number>' },
};
