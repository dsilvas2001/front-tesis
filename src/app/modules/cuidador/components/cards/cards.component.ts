import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    standalone: false
})
export class CardsComponent {
  @Input() cards: { title: string; count: number | string; icon: string }[] =
    [];
}
