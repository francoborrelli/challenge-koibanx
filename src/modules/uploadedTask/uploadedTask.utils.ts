// Utils
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

// Models
import mongoose from 'mongoose';

// Services
import * as taskService from './uploadedTask.service';

// Constants
import { AVAILABLE_FORTATTERS } from './uploadedTask.constants';

// Interfaces
import type { MappingTypes } from './uploadedTask.interfaces';

/**
 * Maps an Excel cell value to the specified type.
 *
 * @param value - The value of the Excel cell.
 * @param type - The type to map the value to.
 * @param optional - Whether the value is optional.
 * @returns The mapped value.
 * @throws Will throw an error if the value is invalid or the type is not recognized.
 */
const mapExcelRow = (value: ExcelJS.CellValue, type: MappingTypes, optional: boolean) => {
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
        .map((num) => {
          if (isNaN(Number(num.trim()))) throw new Error(`Valor inválido en el array: se esperaba Number`);
          return Number(num.trim());
        })
        .sort((a, b) => a - b);

    case 'Array<String>':
      return String(value)
        .split(',')
        .map((item) => item.trim());

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
};

/**
 * Processes a task by its ID.
 *
 * @param id - The ID of the task to process.
 *
 * @throws {Error} If the task is not found.
 *
 * @remarks
 * This function retrieves a task by its ID, processes the associated file, and maps the data according to the specified formatter.
 * It logs the processing steps and handles any errors that occur during the process.
 *
 * @example
 * ```typescript
 * await processTask('60d21b4667d0d8992e610c85');
 * ```
 *
 * @returns {Promise<void>} A promise that resolves when the task processing is complete.
 */
export const processTask = async (id: string): Promise<void> => {
  const task = await taskService.getTaskById(new mongoose.Types.ObjectId(id));

  if (!task) {
    throw new Error('Task not found');
  }

  // Do some processing here
  const file = task.filepath;
  const filePath = path.resolve(file);

  const errors: {
    row: number;
    column: number;
    message: string;
  }[] = [];

  await taskService.updateStatus(task.id, 'processing');

  try {
    const mapping = AVAILABLE_FORTATTERS[task.formatter];

    const workbook = new ExcelJS.Workbook();

    // Leer el archivo Excel desde el disco en streaming
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0]; // Seleccionar la primera hoja

    // Procesar filas una por una en streaming
    worksheet.eachRow({ includeEmpty: false }, async (row, rowIndex) => {
      // Ignorar la primera fila (cabecera)
      if (rowIndex === 1) return;

      const mappedRow: Record<string, any> = {};
      let rowHasError = false;

      // Mapear y validar cada celda
      row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        const columnName = Object.keys(mapping)[colIndex - 1]; // Mapeo según el índice
        const mappedKey = mapping[columnName];

        if (!columnName) {
          return errors.push({
            row: rowIndex,
            column: colIndex,
            message: 'No se esperaba un valor en esta columna',
          });
        }

        const value = cell.value;
        const optional = columnName.endsWith('?');

        try {
          mappedRow[columnName] = mapExcelRow(value, mappedKey, optional);
        } catch (error: any) {
          errors.push({
            row: rowIndex,
            column: colIndex,
            message: error.message,
          });
          rowHasError = true;
        }
      });

      if (!rowHasError) {
        await taskService.createTaskData(task.id, [mappedRow]);
      } else {
        await taskService.createTaskErrors(task.id, errors);
      }
    });

    // Eliminar el archivo del servidor una vez procesado
    // fs.unlinkSync(filePath);
  } catch (error) {
    // Eliminar el archivo en caso de error
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('Error procesando el archivo Excel:', error);
  }

  await taskService.updateStatus(task.id, 'done');
};
