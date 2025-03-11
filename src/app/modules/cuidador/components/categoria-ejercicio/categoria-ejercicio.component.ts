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
  vibilitiCategoria: boolean = false;

  categorias = [
    {
      src: 'https://img.freepik.com/free-photo/side-view-people-studying-classroom_23-2150312826.jpg?t=st=1741625204~exp=1741628804~hmac=2c35ad63a305463a4157120bf54d0ff5a528dc2fb1990f1c6dfb67f0d62340ce&w=1380',
      nombre: 'Memoria',
      explicacion: 'Mejora tu capacidad para recordar información importante.',
    },
    {
      src: 'https://img.freepik.com/free-photo/lonely-woman-confronting-alzheimer-disease_23-2149043761.jpg?t=st=1741625290~exp=1741628890~hmac=bf27b52da86b074771876011bd9e150ccbc82b1cb00b2c48210d86e1fdc9643f&w=740',
      nombre: 'Atención',
      explicacion:
        'Entrena tu mente para mantener el enfoque en tareas específicas.',
    },
    {
      src: 'https://img.freepik.com/free-vector/hand-drawn-vowels-illustration_23-2150138549.jpg?t=st=1741625323~exp=1741628923~hmac=f4db7a049bb57e1db623e59f9608e3852af19916498a9e3d3623b8906151296b&w=900',
      nombre: 'Lenguaje',
      explicacion: 'Fortalece tu vocabulario y habilidades de comunicación.',
    },
    {
      src: 'https://img.freepik.com/free-photo/studio-shot-thoughtful-senior-man-holds-chin-contemplates-about-something-dressed-casually-tries-remember-something-gather-with-thoughts-poses-against-brown-wall_273609-44244.jpg?t=st=1741662302~exp=1741665902~hmac=4db53ddcd704504d5bdee47211828cc5c35329fa5d74d712344133b36becf309&w=1380',
      nombre: 'Razonamiento',
      explicacion:
        'Desarrolla tu capacidad para resolver problemas de manera lógica.',
    },
    {
      src: 'assets/percepcion-icon.png',
      nombre: 'Percepción',
      explicacion: 'Mejora tu interpretación visual y espacial.',
    },
    {
      src: 'assets/funciones-icon.png',
      nombre: 'Funciones Ejecutivas',
      explicacion: 'Optimiza tu planificación y toma de decisiones.',
    },
  ];

  // categorias = [
  //   {
  //     nombre: 'Atención y Concentración',
  //     imagen: 'assets/imgs/atencion.jpg',
  //     descripcion:
  //       'Ejercicios diseñados para mejorar la concentración y la agudeza mental.',
  //     recomendado: true,
  //   },
  //   {
  //     nombre: 'Memoria Relajada',
  //     imagen: 'assets/imgs/memoria.jpg',
  //     descripcion: 'Actividades enfocadas en la memoria con relajación.',
  //     recomendado: true,
  //   },
  //   {
  //     nombre: 'Cálculo Mental',
  //     imagen: 'assets/imgs/calculo.jpg',
  //     descripcion:
  //       'Ejercicios de matemáticas para fortalecer la lógica. No recomendado en baja presión arterial.',
  //     recomendado: false,
  //   },
  //   {
  //     nombre: 'Relajación Cognitiva',
  //     imagen: 'assets/imgs/relajacion.jpg',
  //     descripcion:
  //       'Ejercicios de respiración y música para mejorar la atención.',
  //     recomendado: true,
  //   },
  // ];

  ngOnInit() {
    console.log('Paciente Data:', this._pacienteData);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia la fecha, ejecuta la lógica del checkbox seleccionado
    if (changes['_pacienteData'] && this._pacienteData) {
      console.log('Paciente Data:', this._pacienteData);
    }
  }
  seleccionarCategoria(categoria: string): void {
    console.log('Categoría seleccionada:', categoria);
    alert(`Has seleccionado la categoría: ${categoria}`);
  }
}
