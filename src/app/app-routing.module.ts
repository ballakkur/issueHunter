import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DescriptionComponent } from './description/description.component';
import { SearchComponent } from './search/search.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'description/:no', component: DescriptionComponent },
  { path: 'search', component:SearchComponent },
  { path: 'noti', component:NotificationComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: LoginComponent },
  { path: "*", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
