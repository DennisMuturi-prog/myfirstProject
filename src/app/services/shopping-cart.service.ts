import { inject, Injectable } from '@angular/core';
import {
  combineLatestWith,
  EMPTY,
  shareReplay,
  switchMap,
} from 'rxjs';
import { CartProduct, Product } from '../Types/Types';
import { map, tap, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { ProductService } from './product.service';

interface Cart {
  cartProductId: string;
  userId: string;
  id: string;
}
@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  authService = inject(AuthService);
  productService = inject(ProductService);
  fetchedProducts$: Observable<Product[]> =this.productService.fetchedProducts$;
  firestore = this.authService.firestore;
  currentUser$ = this.authService.currentUser$;
  getCartItems(userId: string): Observable<Cart[]> {
    const collectionRef = collection(this.firestore, 'cartItems');
    const userQuery = query(collectionRef, where('userId', '==', userId));
    return collectionData(userQuery, { idField: 'id' });
  }
  userFetchedCartItems$: Observable<Cart[]> = this.currentUser$.pipe(
    tap((items) => console.log(items)),
    switchMap((user) => {
      if (user) {
        return this.getCartItems(user?.userId);
      } else {
        return EMPTY;
      }
    }),
    shareReplay(1),
    tap((items) => console.log(items))
  );
  noOfCartItems$: Observable<number> = this.userFetchedCartItems$.pipe(
    map((items) => items.length)
  );
  cartDetails$: Observable<CartProduct[]> = this.userFetchedCartItems$.pipe(
    combineLatestWith(this.fetchedProducts$),
    map(([fetchedCart, fetchedProduct]) =>
      this.extractProductDetails(fetchedCart, fetchedProduct)
    ),
    tap((items) => console.log(items))
  );
  extractProductDetails(
    fetchedItems: Cart[],
    products: Product[]
  ): CartProduct[] {
    return fetchedItems.map((itemCart) => {
      let productDetails = products.find(
        (currentProduct) => currentProduct.pid == itemCart.cartProductId
      );
      if (productDetails) {
        return { ...productDetails, id: itemCart.id,quantity:1 };
      } else {
        return {
          title: 'not found',
          pid: '1',
          category: 'default',
          original_price: 1,
          price: 1,
          brand: 'default',
          avg_rating: 1.2,
          discount: 'none',
          images: [],
          id: 'none',
          return_policy: 'none',
          quantity:1
        };
      }
    });
  }

  constructor() {}
}
