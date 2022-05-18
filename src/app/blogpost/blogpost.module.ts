import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogpostRoutingModule } from './blogpost-routing.module';
import { BlogpostFeaturedComponent } from './blogpost-featured/blogpost-featured.component';
import { BlogpostListComponent } from './blogpost-list/blogpost-list.component';
import { BlogpostDetailComponent } from './blogpost-detail/blogpost-detail.component';
import { BlogpostRecentComponent } from './blogpost-recent/blogpost-recent.component';
import { CategoriesComponent } from './categories/categories.component';
import { dirConfig } from '../dir.config'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './orders/cart/cart.component';
import { CheckoutComponent } from './orders/checkout/checkout.component';
@NgModule({
  imports: [
  
  CommonModule,
    BlogpostRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    BlogpostFeaturedComponent
  ],
  declarations: [BlogpostFeaturedComponent, BlogpostListComponent, BlogpostDetailComponent, BlogpostRecentComponent, CategoriesComponent, dirConfig,CartComponent,CheckoutComponent]
})
export class BlogpostModule { }
