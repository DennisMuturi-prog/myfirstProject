import { inject, Injectable } from '@angular/core';
import {
  combineLatestWith,
  EMPTY,
  scan,
  Subject,
  switchMap,
  merge,
  shareReplay,
} from 'rxjs';
import { CartProduct, Product } from '../Types/Types';
import { map, tap, Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import {
  collection,
  doc,
  deleteDoc,
  addDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { ProductService } from './product.service';
import { Router } from '@angular/router';

export interface Cart {
  cartProductId: string;
  userId: string;
  id: string;
}
export interface QuantityAction {
  productId: string;
  action: string;
}
@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  router = inject(Router);
  authService = inject(AuthService);
  productService = inject(ProductService);
  firestore = this.authService.firestore;
  currentUser$ = this.authService.currentUser$;
  fetchedProducts$: Observable<Product[]> =
    this.productService.fetchedProducts$;
  userFetchedCartItems$ = this.productService.userFetchedCartItems$;
  fetchedCartSet$ = this.productService.fetchedCartSet$;
  noOfCartItems$: Observable<number> = this.userFetchedCartItems$.pipe(
    map((items) => items.length)
  );
  productsSet$: Observable<Map<string, Product>> = this.fetchedProducts$.pipe(
    map((products) => {
      const productDetailsMap = new Map<string, Product>();
      products.forEach((product) => {
        productDetailsMap.set(product.pid, product);
      });
      return productDetailsMap;
    })
  );
  cartDetails$: Observable<CartProduct[]> = this.userFetchedCartItems$.pipe(
    combineLatestWith(this.productsSet$),
    map(([fetchedCart, fetchedProduct]) =>
      this.extractProductDetails(fetchedCart, fetchedProduct)
    ),
    tap((items) => console.log(items))
  );
  extractProductDetails(
    fetchedItems: Cart[],
    productDetailsMap: Map<string, Product>
  ): CartProduct[] {
    return fetchedItems.map((itemCart) => {
      const productDetails = productDetailsMap.get(itemCart.cartProductId);
      if (productDetails) {
        return { ...productDetails, id: itemCart.id, quantity: 1 };
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
          quantity: 1,
        };
      }
    });
  }
  addCartItemSubject = new Subject<string>();
  addCartItemAction$ = this.addCartItemSubject.asObservable();
  deleteCartItemSubject = new Subject<string>();
  deleteCartItemAction$ = this.deleteCartItemSubject.asObservable();
  deleteCartItem$ = this.deleteCartItemAction$.pipe(
    combineLatestWith(this.fetchedCartSet$),
    switchMap(([productId, cartGoods]) => {
      let docRef = cartGoods.get(productId);
      if (docRef) {
        return this.deleteCartItem(docRef.id);
      } else {
        this.router.navigate(['home'])
        return EMPTY;
      }
    }),
    tap((item) => console.log(item))
  );
  addCartItem$ = this.addCartItemAction$.pipe(
    combineLatestWith(this.currentUser$),
    switchMap(([productId, user]) => {
      if (user) {
        return this.addCartItem(productId, user.userId);
      } else {
        this.router.navigate(['home'])
        return EMPTY;
      }
    }),
    tap((item) => console.log(item))
  );
  deleteCartItem(id: string) {
    return from(deleteDoc(doc(this.firestore, 'cartItems', id)));
  }
  addCartItem(
    productId: string,
    userId: string
  ): Observable<DocumentReference> {
    return from(
      addDoc(collection(this.firestore, 'cartItems'), {
        cartProductId: productId,
        userId,
      })
    );
  }
  changeQuantitySubject = new Subject<QuantityAction>();
  changeQuantityAction$ = this.changeQuantitySubject.asObservable();
  cartWithQuantityChanging$: Observable<CartProduct[]> = merge(
    this.cartDetails$.pipe(map(this.addHandler)),
    this.changeQuantityAction$.pipe(map(this.changeHadler))
  ).pipe(
    scan((state: CartProduct[], stateHandler) => stateHandler(state), []),
    shareReplay(1)
  );
  addHandler(products: CartProduct[]) {
    return (state: CartProduct[]) => [...products];
  }
  changeHadler(quantityAction: QuantityAction) {
    return (state: CartProduct[]) =>
      state.map((good) => {
        if (good.pid == quantityAction.productId) {
          if (quantityAction.action == 'increase') {
            return { ...good, quantity: good.quantity + 1 };
          } else {
            return { ...good, quantity: good.quantity - 1 };
          }
        } else {
          return good;
        }
      });
  }
  constructor() {}
}
