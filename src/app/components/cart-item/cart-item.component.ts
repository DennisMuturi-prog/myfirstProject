import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartProduct} from '../../Types/Types';
import { CurrencyPipe } from '@angular/common';
import { ProductImageComponent } from '../product-image/product-image.component';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CurrencyPipe,
    ProductImageComponent,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  cartService = inject(ShoppingCartService);
  productDetails = input.required<CartProduct>();
  deleteCartItem$ = this.cartService.deleteCartItem$.pipe(takeUntilDestroyed());
  productTotalPrice = computed(
    () => this.productDetails().price * this.productDetails().quantity
  );
  increaseQuantity() {
    this.cartService.changeQuantitySubject.next({
      productId: this.productDetails().pid,
      action: 'increase',
    });
  }
  decreaseQuantity() {
    this.cartService.changeQuantitySubject.next({
      productId: this.productDetails().pid,
      action: 'decrease',
    });
  }
  removeFromCart() {
    this.deleteCartItem$.subscribe();
    this.cartService.deleteCartItemSubject.next(this.productDetails().pid);
  }
}
