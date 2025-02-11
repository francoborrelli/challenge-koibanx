import ExcelJS from 'exceljs';
import { MappingTypes } from '../../domain/constants/mappings';

export class ExcelMapper {
  static mapValue(value: ExcelJS.CellValue, type: MappingTypes, optional: boolean): any {
    if (!value && optional) return null;
    if (!value) throw new Error(`Valor inválido: se esperaba ${type}`);

    switch (type) {
      case 'String':
        return String(value).trim();
      case 'Number':
        if (isNaN(Number(value))) throw new Error(`Valor inválido: se esperaba ${type}`);
        return Number(value);
      case 'Boolean':
        if (value !== 'true' && value !== 'false' && value !== '1' && value !== '0')
          throw new Error(`Valor inválido: se esperaba ${type}`);
        return value === 'true' || value === '1';
      case 'Array<Number>':
        return String(value)
          .split(',')
          .map((item) => {
            if (isNaN(Number(item.trim()))) throw new Error(`Valor inválido en el array: se esperaba Number`);
            return Number(item.trim());
          })
          .sort((a, b) => a - b);
      case 'Array<String>':
        return String(value)
          .split(',')
          .map((item) => item.trim())
          .sort();
      case 'Array<Boolean>':
        return String(value)
          .split(',')
          .map((item) => {
            if (item !== 'true' && item !== 'false' && item !== '1' && item !== '0')
              throw new Error(`Valor inválido en el array: se esperaba Boolean`);
            return item === 'true' || item === '1';
          });
      case 'Date':
        if (isNaN(Date.parse(String(value)))) throw new Error(`Valor inválido: se esperaba Fecha`);
        return new Date(String(value));
      default:
        throw new Error(`Tipo inválido: ${type}`);
    }
  }
}
