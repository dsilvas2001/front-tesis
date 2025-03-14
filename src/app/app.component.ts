import { Component } from '@angular/core';
import { LoadingService } from './core/loading/loading.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  isLoading = false;
  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe((url) => {
      console.log('Rutas activas:', url);
    });
  }

  ngOnInit() {}
}
