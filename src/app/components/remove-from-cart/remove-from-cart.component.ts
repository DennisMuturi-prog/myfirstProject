import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-remove-from-cart',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './remove-from-cart.component.html',
  styleUrl: './remove-from-cart.component.css',
})
export class RemoveFromCartComponent {
  productId = input.required<string>();
  cartService = inject(ShoppingCartService);
  deleteCartItem$ = this.cartService.deleteCartItem$.pipe(takeUntilDestroyed());
  remove() {
    this.deleteCartItem$.subscribe()
    this.cartService.deleteCartItemSubject.next(this.productId());
  }
}
