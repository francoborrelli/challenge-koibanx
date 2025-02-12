import { expect, describe, it } from '@jest/globals';

// Utils
import { ExcelMapper } from '../../src/infraestructure/excel/utils';

describe('mapExcelRow', () => {
  it('should map string value correctly', () => {
    const value = '  hello ';
    const mappedValue = ExcelMapper.mapValue(value, 'String', false);
    expect(mappedValue).toBe('hello');
  });

  it('should map number value correctly', () => {
    const value = '42';
    const mappedValue = ExcelMapper.mapValue(value, 'Number', false);
    expect(mappedValue).toBe(42);
  });

  it('should throw an error for invalid number value', () => {
    const value = 'abc';
    expect(() => ExcelMapper.mapValue(value, 'Number', false)).toThrow('Valor inválido: se esperaba Number');
  });

  it('should map boolean value correctly', () => {
    const value = 'true';
    const mappedValue = ExcelMapper.mapValue(value, 'Boolean', false);
    expect(mappedValue).toBe(true);
  });

  it('should throw an error for invalid boolean value', () => {
    const value = 'not-a-boolean';
    expect(() => ExcelMapper.mapValue(value, 'Boolean', false)).toThrow('Valor inválido: se esperaba Boolean');
  });

  it('should map array of strings correctly', () => {
    const value = '  hello, world,  test  ';
    const mappedValue = ExcelMapper.mapValue(value, 'Array<String>', false);
    expect(mappedValue).toEqual(['hello', 'world', 'test']);
  });

  it('should map array of numbers correctly', () => {
    const value = ' 1, 2 , 3 ';
    const mappedValue = ExcelMapper.mapValue(value, 'Array<Number>', false);
    expect(mappedValue).toEqual([1, 2, 3]);
  });

  it('should throw an error for invalid array of numbers', () => {
    const value = '1, not-a-number, 3';
    expect(() => ExcelMapper.mapValue(value, 'Array<Number>', false)).toThrow(
      'Valor inválido en el array: se esperaba Number'
    );
  });

  it('should map array of booleans correctly', () => {
    const value = 'true, false, 1';
    const mappedValue = ExcelMapper.mapValue(value, 'Array<Boolean>', false);
    expect(mappedValue).toEqual([true, false, true]);
  });

  it('should throw an error for invalid array of booleans', () => {
    const value = 'true, maybe, false';
    expect(() => ExcelMapper.mapValue(value, 'Array<Boolean>', false)).toThrow(
      'Valor inválido en el array: se esperaba Boolean'
    );
  });

  it('should map date value correctly', () => {
    const value = '2024-12-30';
    const mappedValue = ExcelMapper.mapValue(value, 'Date', false) as Date;
    expect(mappedValue).toBeInstanceOf(Date);
    expect(mappedValue.toISOString()).toBe(new Date('2024-12-30').toISOString());
  });

  it('should throw an error for invalid date value', () => {
    const value = 'not-a-date';
    expect(() => ExcelMapper.mapValue(value, 'Date', false)).toThrow('Valor inválido: se esperaba Fecha');
  });

  it('should return null for optional value', () => {
    const value = '';
    const mappedValue = ExcelMapper.mapValue(value, 'String', true);
    expect(mappedValue).toBeNull();
  });

  it('should throw an error for empty value when not optional', () => {
    const value = '';
    expect(() => ExcelMapper.mapValue(value, 'String', false)).toThrow('Valor inválido: se esperaba String');
  });
});
