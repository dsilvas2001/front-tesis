import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './modules/home/home.module';
import { DashboardComponent } from './modules/cuidador/pages/dashboard/dashboard.component';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'LandingPage',
    canActivate: [NoAuthGuard],
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'Auth',
    canActivate: [NoAuthGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'Cuidador',
    canActivate: [AuthGuard],
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
