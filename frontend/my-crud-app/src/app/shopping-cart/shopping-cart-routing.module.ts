// shopping-cart-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsComponent } from './cards/cards.component';

const routes: Routes = [
  { path: 'cards', component: CardsComponent },
  { path: 'shopping-cart', loadChildren: () => import('./panier/panier.component').then(m => m.PanierComponent) },

  { path: '', redirectTo: '/ecommerce', pathMatch: 'full' },
  { path: '**', redirectTo: '/ecommerce' }, // Add a wildcard route to redirect any unknown routes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingCartRoutingModule {}
