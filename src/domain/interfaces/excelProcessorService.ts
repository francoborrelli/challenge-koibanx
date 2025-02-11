export interface IExcelProcessorService {
  processTask(taskId: string): Promise<void>;
}
