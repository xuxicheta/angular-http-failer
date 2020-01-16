import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClearerDirective } from './clearer.directive';
import { ErrorSelectorComponent } from './error-selector/error-selector.component';
import { FailerComponent } from './failer/failer.component';
import { configComplete, FailerConfig, FAILER_CONFIG } from './indexeddb/db-config';
import { DbService } from './indexeddb/db.service';
import { FailerInterceptor, failerInterceptorProvider } from './services/failer.interceptor';
import { FailerHandlerService } from './services/failer-handler.service';
import { SortDirective } from './sort.directive';
import { FailerOpenerService } from './services/failer-opener.service';
import { DeleteComponent } from './delete/delete.component';

@NgModule({
  declarations: [FailerComponent, SortDirective, ErrorSelectorComponent, ClearerDirective, DeleteComponent],
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
        FailerHandlerService,
        FailerOpenerService,
        FailerInterceptor,
        DbService,
      ]
    };
  }
}
