import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEvComponent } from './admin-ev/admin-ev.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmpleadoTEAMLESSComponent } from './empleado-teamless/empleado-teamless.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'adminEV', component: AdminEvComponent},
  { path: 'empleadoTEAMLESS', component: EmpleadoTEAMLESSComponent}
];

const isIframe = window !== window.parent && !window.opener;


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: !isIframe ? 'enabled' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
