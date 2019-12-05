import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DbService, KEY_PATH, OBJECT_NAME } from './db.service';
import { FailerInterceptor, failerInterceptorProvider } from './failer.interceptor';
import { FailerService } from './failer.service';
import { FailerComponent } from './failer/failer.component';

@NgModule({
  declarations: [FailerComponent],
  entryComponents: [FailerComponent],
  imports: [
    CommonModule,
    OverlayModule,
    CdkTableModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [FailerComponent],
  providers: [
    {
      provide: KEY_PATH,
      useValue: 'requestId',
    },
    {
      provide: OBJECT_NAME,
      useValue: 'failer-requests',
    },
    failerInterceptorProvider,
    FailerService,
    FailerInterceptor,
    DbService,
  ]
})
export class FailerModule { }
