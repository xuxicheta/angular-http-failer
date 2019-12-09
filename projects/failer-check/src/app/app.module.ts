import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { FailerModule } from 'failer';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserComponent
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
