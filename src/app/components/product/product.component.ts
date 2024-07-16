import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../Types/Types';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { ProductImageComponent } from '../product-image/product-image.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    ProductImageComponent,
    StarRatingComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  product=input.required<Product>();
  alreadyBought=signal(false)
  cartService=inject(ShoppingCartService)
  buyItem():void{
    if(this.alreadyBought()){
      this.cartService.removeFromCartSubject.next(this.product())
      this.alreadyBought.set(false)
    }
    else{
       this.cartService.addToCartSubject.next(this.product());
       this.alreadyBought.set(true)
    }
  }
}
