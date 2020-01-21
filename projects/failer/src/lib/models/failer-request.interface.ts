import { RequestMold } from './request-mold.interface';

export interface FailerRequest {
  errorCode: number;
  message: string;
  requestMold: RequestMold;
  requestId: string;
  delay: number;
}
