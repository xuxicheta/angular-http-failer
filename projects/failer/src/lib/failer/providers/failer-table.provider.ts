import { InjectionToken, ValueProvider } from '@angular/core';

const headers = {
  method: 'Method',
  url: 'Url',
  delay: 'Delay, ms',
  errorCode: 'ErrorCode',
  delete: ''
} as const;
const columns = Object.keys(headers) as Readonly<(keyof typeof headers)[]>;

const tableData = {
  headers,
  columns,
};

export type FailerTableType = typeof tableData;

export const FAILER_TABLE = new InjectionToken<FailerTableType>('FAILER_TABLE');

export const failerTableProvider: ValueProvider = {
  provide: FAILER_TABLE,
  useValue: tableData,
};
