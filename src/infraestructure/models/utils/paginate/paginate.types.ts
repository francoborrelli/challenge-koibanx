import { Model, Document } from 'mongoose';

import { QueryResult as QR } from '../../../../domain/entities/pagination';

export interface QueryResult extends QR {
  results: Document[];
}

/**
 * Interface representing pagination options.
 */
export interface IOptions {
  /**
   * Specifies the field by which to sort the results.
   * @description The field name to sort by.
   */
  sortBy?: string;

  /**
   * Specifies the fields to include or exclude in the results.
   * @description The field names to project.
   */
  projectBy?: string;

  /**
   * Specifies the related documents to include in the results.
   * @description The field names to populate.
   */
  populate?: string;

  /**
   * Specifies the maximum number of results per page.
   * @description The limit of results per page.
   */
  limit?: number;

  /**
   * Specifies the page number to retrieve.
   * @description The page number to fetch.
   */
  page?: number;
}

export interface ITask {
  name: string;
  project: string;
}

export interface ITaskDoc extends ITask, Document {}

export interface ITaskModel extends Model<ITaskDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}
