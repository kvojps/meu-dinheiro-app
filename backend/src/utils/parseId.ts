import { AppError } from '../errors/AppError';

export function parseId(raw: string | string[]): number {
  if (typeof raw !== 'string') {
    throw new AppError(400, 'Invalid id');
  }
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'Invalid id');
  }
  return id;
}
