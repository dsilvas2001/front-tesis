import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styles: ``,
})
export class NotificationsComponent implements OnInit {
  @Input() statusnotification: boolean = true;
  @Input() title: string = 'Notificación';
  @Input() message: string = 'Este es un mensaje de notificación.';
  @Input() type: string = 'success';
  @Output() deleteAction = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (this.statusnotification) {
      setTimeout(() => {
        this.statusnotification = false;
      }, 3000);
    }
  }
  closeNotificationDelete() {
    this.statusnotification = false;
    this.deleteAction.emit(false);
  }
  confirmDelete(): void {
    this.statusnotification = false;
    this.deleteAction.emit(true);
  }
}
