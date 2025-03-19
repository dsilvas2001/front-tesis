import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Ejercicio {
  titulo: string;
  descripcion: string;
  instrucciones: string;
  contenido: {
    contenido: string;
    opciones: { texto: string; imagen: string }[];
    respuesta_correcta: string[];
  };
}

@Component({
  selector: 'app-welcome-ejercicio',
  templateUrl: './welcome-ejercicio.component.html',
  styles: ``,
})
export class WelcomeEjercicioComponent {
  ejercicios: Ejercicio[] = [];

  mensaje: string = '¡Bienvenido a los Ejercicios Cognitivos!';
  descripcion: string =
    'Explora y comienza a ejercitar tu mente con nuestros ejercicios diseñados para potenciar tus habilidades cognitivas.';

  listaEjercicios = [
    {
      titulo: 'Encuentra el Objeto Correcto',
      descripcion:
        'Ejercicio de atención donde debes identificar el objeto correcto entre varias opciones.',
      instrucciones: 'Selecciona la opción correcta.',
      contenido: {
        contenido: 'El cielo es de color ____.',
        opciones: [
          { texto: 'Vaso', imagen: 'URL_VASO' },
          { texto: 'Tenedor', imagen: 'URL_TENEDOR' },
          { texto: 'Plato', imagen: 'URL_PLATO' },
          { texto: 'Cuchara', imagen: 'URL_CUCHARA' },
        ],
        respuesta_correcta: ['Vaso'],
      },
    },
    {
      titulo: 'Encuentra el Color Correcto',
      descripcion:
        'Ejercicio de atención donde debes recordar el color mencionado previamente.',
      instrucciones: 'Selecciona el color correcto.',
      contenido: {
        contenido: 'El color del cielo es:',
        opciones: [
          { texto: 'Rojo', imagen: 'URL_AZUL' },
          { texto: 'Verde', imagen: 'URL_VERDE' },
          { texto: 'Azul', imagen: 'URL_ROJO' },
          { texto: 'Amarillo', imagen: 'URL_AMARILLO' },
        ],
        respuesta_correcta: ['Azul'],
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (history.state.ejercicios) {
      this.ejercicios = history.state.ejercicios;
    } else {
      this.router.navigate(['/Cuidador/ejercicios']);
    }
  }

  iniciarEjercicio(): void {
    this.router.navigate(['/Cuidador/ejercicios/ejercicio-multiple'], {
      state: { ejercicios: this.ejercicios },
    });
  }
}
