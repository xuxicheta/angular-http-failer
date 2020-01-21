import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteComponent } from './delete/delete.component';
import { ClearerDirective } from './directives/clearer.directive';
import { SortDirective } from './directives/sort.directive';
import { ErrorSelectorComponent } from './error-selector/error-selector.component';
import { FailerComponent } from './failer/failer.component';
import { configComplete, FailerConfig, FAILER_CONFIG } from './indexeddb/db-config';
import { DbService } from './indexeddb/db.service';
import { failerBootstrapProvider } from './services/failer-bootstrap.provider';
import { FailerHandlerService } from './services/failer-handler.service';
import { failerInitProvider } from './services/failer-init.provider';
import { FailerKeyBusService } from './services/failer-key-bus.service';
import { FailerOpenerService } from './services/failer-opener.service';
import { FailerInterceptor, failerInterceptorProvider } from './services/failer.interceptor';
import { FailerEntitiesState } from './state/failer-entities.state';
import { FailerSortState } from './state/failer-sort.state';
import { FailerUiState } from './state/failer-ui.state';
import { FailerMediator } from './state/failer.mediator';

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
        failerBootstrapProvider,
        failerInitProvider,
        FailerKeyBusService,
        FailerHandlerService,
        FailerOpenerService,
        FailerInterceptor,
        FailerEntitiesState,
        FailerSortState,
        FailerUiState,
        FailerMediator,
        DbService,
      ]
    };
  }
}
