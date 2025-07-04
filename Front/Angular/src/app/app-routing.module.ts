import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './search/searchResults/searchResults.component';

const routes: Routes = [
  { path: "", redirectTo: "books", pathMatch: "full" },
  { path: "search/:query", component: SearchResultsComponent },
  { path: "**", redirectTo: "books", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
