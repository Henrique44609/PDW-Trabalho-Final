import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaComponent } from './categoria/categoria.component';
import { LoginComponent } from './login/login.component';

import { DespesasComponent } from './menu/despesas/despesas.component';
import { ExportComponent } from './menu/export/export.component';
import { EvolucaoComponent } from './menu/grafico/evolucao/evolucao.component';
import { MenuComponent } from './menu/menu.component';
import { SubcategoriasComponent } from './menu/subcategorias/subcategorias.component';
import { UpdatepassComponent } from './menu/updatepass/updatepass.component';
import { AlterarComponent } from './password/alterar/alterar.component';
import { CodigoComponent } from './password/codigo/codigo.component';
import { PasswordComponent } from './password/password.component';
import { RegisterComponent } from './register/register.component';




const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'password', component: PasswordComponent},
  {path:'codigo', component: CodigoComponent}, 
  {path:'alterar', component: AlterarComponent},
  {path:'menu', component:MenuComponent, children : [
    {path:'evolucao', component:EvolucaoComponent}, 
    {path:'export', component: ExportComponent},
    {path:'update', component: UpdatepassComponent},
    {path:'subcategorias',component: SubcategoriasComponent},
    {path:'categoria',component: CategoriaComponent},
    {path:'despesas',component: DespesasComponent}
  ]},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const appRoutingModule = RouterModule.forRoot(routes);
