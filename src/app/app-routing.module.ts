import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './modules/home/home.module';
import { DashboardComponent } from './modules/cuidador/pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'LandingPage',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'Auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'Cuidador',
    loadChildren: () =>
      import('./modules/cuidador/cuidador.module').then(
        (m) => m.CuidadorModule
      ),
  },
  {
    path: '**',
    redirectTo: 'LandingPage',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
