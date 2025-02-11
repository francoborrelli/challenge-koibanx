import { AvalilableFormatters } from '../../domain/constants/mappings';

export class GetTaskFormatters {
  constructor() {}

  async execute() {
    return AvalilableFormatters;
  }
}
