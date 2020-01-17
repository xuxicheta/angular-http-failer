import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FailerModule } from 'failer';
import { AppComponent } from './app.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { ResultComponent } from './result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonsComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FailerModule.forRoot({ prefix: 'failer-check_' }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
