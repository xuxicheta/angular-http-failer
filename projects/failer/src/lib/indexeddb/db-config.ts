import { InjectionToken } from '@angular/core';

export interface FailerConfig {
  /** prefix for indexed db name */
  prefix: string;
  /** keyPath in indexed db */
  keyPath: string;
  /** keyPath of indexed db */
  objectName: string;
}

export const FAILER_CONFIG = new InjectionToken<FailerConfig>('FailerConfig');

export function configComplete(config: Partial<FailerConfig> = {}): FailerConfig {
  return {
    prefix: config.prefix || '',
    keyPath: config.keyPath || 'requestId',
    objectName: config.objectName || 'failer-requests',
  };
}
