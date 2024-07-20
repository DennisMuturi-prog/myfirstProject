import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../Types/Types';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { ProductImageComponent } from '../product-image/product-image.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import {toSignal} from '@angular/core/rxjs-interop'
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { RemoveFromCartComponent } from '../remove-from-cart/remove-from-cart.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    ProductImageComponent,
    StarRatingComponent,
    AddToCartComponent,
    RemoveFromCartComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  product=input.required<Product>();
}
