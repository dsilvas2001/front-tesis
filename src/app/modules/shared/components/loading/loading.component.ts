import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styles: './loading.component.css',
})
export class LoadingComponent implements OnInit {
  isLoading = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }
}
