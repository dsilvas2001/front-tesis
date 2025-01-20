import { Component } from '@angular/core';
import { LoadingService } from './core/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  isLoading = false;

  ngOnInit() {}
}
