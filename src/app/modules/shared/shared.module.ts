import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [NotificationsComponent, LoadingComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  exports: [
    NotificationsComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoadingComponent,
  ],
})
export class SharedModule {}
