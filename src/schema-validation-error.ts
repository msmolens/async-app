import { ValidationError } from './types';

export class SchemaValidationError extends Error {
  constructor(public errors: ValidationError[], public source: string) {
    super('SCHEMA_VALIDATION_ERROR');
    this.name = 'SchemaValidationError';
  }
}
