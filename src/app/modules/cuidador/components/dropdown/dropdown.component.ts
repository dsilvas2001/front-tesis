import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styles: ``,
    standalone: false
})
export class DropdownComponent {
  @Input() dropdownTitle: string = 'Dropdown'; // Título personalizable
  @Input() fields: any[] = []; // Campos del dropdown
  isDropdownOpen: boolean = false;
  @Output() fieldChange = new EventEmitter<any>();

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onFieldChange(field: any): void {
    this.fieldChange.emit(field);
  }
}
