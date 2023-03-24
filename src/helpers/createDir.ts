import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function ensureDir() {
  const dir = resolve(join(__dirname, '../../tmp'));
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  return dir;
}
