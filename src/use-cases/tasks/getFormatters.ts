import { AvalilableFormatters } from 'src/domain/constants/mappings';

export class GetTaskFormatters {
  constructor() {}

  async execute() {
    return AvalilableFormatters;
  }
}
