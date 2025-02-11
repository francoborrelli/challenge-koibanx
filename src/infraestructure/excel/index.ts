import path from 'path';
import ExcelJS from 'exceljs';
import { ExcelMapper } from './utils';

// Constants
import { AvalilableFormatters } from '../../domain/constants/mappings';

import type { IExcelProcessorService } from '../../domain/interfaces/excelProcessorService';

import type {
  ITaskRepository,
  ITaskDataRepository,
  ITaskErrorRepository,
} from '../../domain/interfaces/taskRepository';

export class ExcelProcessorService implements IExcelProcessorService {
  constructor(
    private readonly _taskRepository: ITaskRepository,
    private readonly _taskDataRepository: ITaskDataRepository,
    private readonly _taskErrorRepository: ITaskErrorRepository
  ) {}

  async processTask(taskId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const task = await this._taskRepository.findById(taskId);

      if (!task) {
        console.error('No se encontró la tarea con el ID:', taskId);
        return reject('No se encontró la tarea con el ID especificado');
      }

      const filePath = path.resolve(task.filepath);
      const errors: { row: number; column: number; message: string }[] = [];

      try {
        const mapping = AvalilableFormatters[task.formatter];
        const workbook = new ExcelJS.stream.xlsx.WorkbookReader(filePath, { worksheets: 'emit' });

        workbook.read();

        for await (const worksheetReader of workbook) {
          // @ts-ignore
          if (!worksheetReader || worksheetReader.id !== 1) continue;

          for await (const row of worksheetReader) {
            if (row.number === 1) continue;

            const mappedRow: Record<string, any> = {};
            let rowHasError = false;

            row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
              const columnName = Object.keys(mapping)[colIndex - 1];
              const mappedKey = mapping[columnName];

              if (!columnName) {
                errors.push({ row: row.number, column: colIndex, message: 'No se esperaba un valor en esta columna' });
                return;
              }

              const optional = columnName.endsWith('?');

              try {
                mappedRow[columnName] = ExcelMapper.mapValue(cell.value, mappedKey, optional);
              } catch (error: any) {
                errors.push({ row: row.number, column: colIndex, message: error.message });
                rowHasError = true;
              }
            });

            if (!rowHasError) {
              await this._taskDataRepository.create(task._id, [mappedRow]);
            } else {
              await this._taskErrorRepository.create(task._id, errors);
            }
          }
        }

        resolve(null);
      } catch (error) {
        console.error('Error procesando el archivo Excel:', error);
        reject(error);
      }
    });
  }
}
