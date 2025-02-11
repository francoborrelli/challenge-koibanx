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
