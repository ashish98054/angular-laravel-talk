import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { RootComponent } from './root.component';
import { AppRoutingModule } from './app.routing.module';
import { LoginComponent, SocialComponent } from './components/auth';
import { AuthComponent, AppComponent, ErrorComponent } from './components/layouts';

@NgModule({
  declarations: [
    RootComponent,
    AuthComponent,
    AppComponent,
    ErrorComponent,
    LoginComponent,
    SocialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
