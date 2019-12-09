import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configComplete, FailerConfig, FAILER_CONFIG } from './config';
import { DbService } from './db.service';
import { FailerInterceptor, failerInterceptorProvider } from './failer.interceptor';
import { FailerService } from './failer.service';
import { FailerComponent } from './failer/failer.component';
import { SortDirective } from './sort.directive';

@NgModule({
  declarations: [FailerComponent, SortDirective],
  entryComponents: [FailerComponent],
  imports: [
    CommonModule,
    OverlayModule,
    CdkTableModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class FailerModule {
  static forRoot(config?: Partial<FailerConfig>): ModuleWithProviders {
    return {
      ngModule: FailerModule,
      providers: [
        {
          provide: FAILER_CONFIG,
          useValue: configComplete(config),
        },
        failerInterceptorProvider,
        FailerService,
        FailerInterceptor,
        DbService,
      ]
    };
  }
}
