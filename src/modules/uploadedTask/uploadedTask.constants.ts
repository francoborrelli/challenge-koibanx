import type { MappingTypes } from './uploadedTask.interfaces';

// Constante que define los formateadores disponibles
// La clave de primer nivel es un número que representa un tipo de formateador
// El valor es un objeto que mapea nombres de campos a sus tipos correspondientes
export const AVAILABLE_FORTATTERS: Record<number, Record<string, MappingTypes>> = {
  0: { name: 'String', age: 'Number', nums: 'Array<Number>' },
  1: { name: 'Number', age: 'String', 'nums?': 'Array<Number>' },
};
