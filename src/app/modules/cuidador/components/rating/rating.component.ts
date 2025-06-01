import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  standalone: false,
  templateUrl: './rating.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {
  @Input() max: number = 5;
  @Input() value: number = 0; // ¡Este es el campo crítico que falta!

  @Output() valueChange = new EventEmitter<number>();
  stars: number[] = [];
  hoverIndex: number | null = null; // Nueva variable para el efecto hover
  @Input() disabled: boolean = false;

  // Funciones requeridas por ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit() {
    this.stars = Array(this.max).fill(0);
  }

  rate(newValue: number) {
    this.value = newValue;
    this.valueChange.emit(this.value);
    this.onChange(this.value); // Notifica a Angular Forms del cambio
    this.onTouched();
  }

  // Métodos de ControlValueAccessor
  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
