import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VoteComponent} from './vote/vote.component';
import {CreateVotingComponent} from './create-voting/create-voting.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {path: 'vote', component: VoteComponent},
  {path: 'create', component: CreateVotingComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
