import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-categoria-ejercicio',
  templateUrl: './categoria-ejercicio.component.html',
  styles: ``,
})
export class CategoriaEjercicioComponent implements OnInit, OnChanges {
  @Input() _pacienteData: any;
  ngOnInit() {
    console.log('Paciente Data:', this._pacienteData);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia la fecha, ejecuta la lógica del checkbox seleccionado
    if (changes['_pacienteData'] && this._pacienteData) {
      console.log('Paciente Data:', this._pacienteData);
    }
  }
}
