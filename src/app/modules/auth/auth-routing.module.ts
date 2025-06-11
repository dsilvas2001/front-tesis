import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CentroGerontologicoComponent } from './centro-gerontologico/centro-gerontologico.component';
import { SeleccionarComponent } from './centro-gerontologico/seleccionar/seleccionar.component';
import { CrearComponent } from './centro-gerontologico/crear/crear.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: SignInComponent },
      { path: 'register', component: SignUpComponent },
      {
        path: 'centro-gerontologico',
        component: CentroGerontologicoComponent,
        children: [
          { path: 'seleccionar', component: SeleccionarComponent },
          { path: 'crear', component: CrearComponent },
          { path: '', redirectTo: 'seleccionar', pathMatch: 'full' },
        ],
      },
      { path: '**', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
