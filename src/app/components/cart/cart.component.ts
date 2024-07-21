import { Component, inject } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { CartProduct } from '../../Types/Types';
import { Observable, shareReplay ,map} from 'rxjs';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    AsyncPipe,
    CartItemComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatTableModule,
    CurrencyPipe,
    MatDividerModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  router = inject(Router);
  shoppingCartService = inject(ShoppingCartService);
  cartItems$: Observable<CartProduct[]> =this.shoppingCartService.cartWithQuantityChanging$.pipe(shareReplay(1));
  totalCost$=this.cartItems$.pipe(
    map((items)=>items.reduce((acc,curr)=>acc+(curr.price*curr.quantity),0))
  )
  goToHome() {
    this.router.navigate(['home']);
  }
  columnsToDisplay = ['title', 'price', 'quantity', 'totalPrice'];
}
