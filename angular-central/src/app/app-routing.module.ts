import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEvComponent } from './admin-ev/admin-ev.component';
import { EmpleadoTEAMLESSComponent } from './empleado-teamless/empleado-teamless.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'adminEV', component: AdminEvComponent},
  { path: 'empleadoTEAMLESS', component: EmpleadoTEAMLESSComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
