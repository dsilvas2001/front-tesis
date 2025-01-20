import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { errorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: loggingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: errorHandlingInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
