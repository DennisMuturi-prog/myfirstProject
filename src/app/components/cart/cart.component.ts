import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table'
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { AsyncPipe } from '@angular/common';
import { CartProduct } from '../../Types/Types';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatTableModule,AsyncPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  shoppingCartService=inject(ShoppingCartService)
  cartItems$:Observable<CartProduct[]>=this.shoppingCartService.cartDetails$
  columnsToDisplay=['title','brand','price','quantity']
}
