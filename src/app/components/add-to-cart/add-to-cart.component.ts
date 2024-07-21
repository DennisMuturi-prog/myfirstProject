import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css'
})
export class AddToCartComponent {
  productId=input.required<string>()
  cartService=inject(ShoppingCartService)
  addCartItem$=this.cartService.addCartItem$.pipe(takeUntilDestroyed())
  buy(){
    this.addCartItem$.subscribe()
    this.cartService.addCartItemSubject.next(this.productId())
  }

}
