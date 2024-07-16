import { inject, Injectable } from '@angular/core';
import { combineLatestWith, concatMap, EMPTY, from, of, shareReplay, Subject } from 'rxjs';
import { CartProduct, Product } from '../Types/Types';
import { merge ,map,scan,tap,Observable} from 'rxjs';
import { AuthService } from './auth.service';
import { addDoc, collection, doc,deleteDoc,collectionData} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  authService = inject(AuthService);
  firestore = this.authService.firestore;
  currentUser$ = this.authService.currentUser$;
  addToCartSubject = new Subject<Product>();
  addToCartAction$ = this.addToCartSubject.asObservable();
  removeFromCartSubject = new Subject<Product>();
  removeFromCartAction$ = this.removeFromCartSubject.asObservable();
  addCartItem$ = this.addToCartAction$.pipe(
    combineLatestWith(this.currentUser$),
    concatMap(([product, user]) => {
      if (user !== null) {
        return this.saveCartitem(product, user.userId);
      } else {
        return EMPTY;
      }
    })
  );
  cartItems$ = merge(
    this.removedSavedCartItem$.pipe(map(this.deleteHandler)),
    this.addCartItem$.pipe(map(this.addHandler))
  ).pipe(
    scan((state: CartProduct[], stateHandler) => stateHandler(state), []),
    shareReplay(1)
  );
  removedSavedCartItem$ = this.removeFromCartAction$.pipe(
    combineLatestWith(this.cartItems$),
    map(([itemToRemove, cartItems]) => [
      ...cartItems.filter((cartItem) => cartItem.pid == itemToRemove.pid),
    ]),
    concatMap((cartItemToRemove) => this.removeCartItem(cartItemToRemove[0]))
  );
  noOfItemsInCart$ = this.cartItems$.pipe(map((cartItems) => cartItems.length));
  addHandler(Product: CartProduct) {
    return (state: CartProduct[]) => [...state, Product];
  }
  deleteHandler(productId: string) {
    return (state: CartProduct[]) => [
      ...state.filter((Productitem) => Productitem.pid !== productId),
    ];
  }
  saveCartitem(product: Product, userId: string) {
    return from(
      addDoc(collection(this.firestore, 'cartItems'), {
        cartProductId: product.pid,
        userId,
      })
    ).pipe(
      tap((value) => console.log(value)),
      map((docRef) => ({ ...product, docReference: docRef.id }))
    );
  }
  removeCartItem(product: CartProduct) {
    return from(
      deleteDoc(doc(this.firestore, 'cartItems', product.docReference))
    ).pipe(map(() => product.pid));
  }
  firstExpensesHandler(expenses: Product[]) {
    return (state: Product[]) => [...state, ...expenses];
  }
  getCartItems(): Observable<Product[]> {
    const productCollection = collection(this.firestore, 'cartItems');
    console.log('fetch');
    return collectionData<Product[]>(productCollection);
  }

  constructor() {}
}
