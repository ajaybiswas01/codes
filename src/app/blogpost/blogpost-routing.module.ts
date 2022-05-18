import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogpostListComponent } from './blogpost-list/blogpost-list.component';
import { BlogpostDetailComponent } from './blogpost-detail/blogpost-detail.component';
import { CartComponent } from './orders/cart/cart.component';
import { CheckoutComponent } from './orders/checkout/checkout.component';

const routes: Routes = [
  {path: 'blog', component: BlogpostListComponent},
  {path: 'blog/:id', component: BlogpostDetailComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout', component: CheckoutComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogpostRoutingModule { }
