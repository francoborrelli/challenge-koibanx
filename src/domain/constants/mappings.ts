export enum AvailableMappingsTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  'Array<String>' = 'array<string>',
  'Array<Number>' = 'array<number>',
  'Array<Boolean>' = 'array<boolean>',
}

export type MappingTypes = keyof typeof AvailableMappingsTypes;

export const MappingsArray = Object.keys(AvailableMappingsTypes) as MappingTypes[];

export const AvalilableFormatters: Record<number, Record<string, MappingTypes>> = {
  0: { name: 'String', age: 'Number', nums: 'Array<Number>' },
  1: { name: 'Number', age: 'String', 'nums?': 'Array<Number>' },
};
