import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class App {}
