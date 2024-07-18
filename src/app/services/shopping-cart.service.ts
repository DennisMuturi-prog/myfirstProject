import { inject, Injectable } from '@angular/core';
import { combineLatestWith, concatMap, EMPTY, from, of, shareReplay, Subject, switchMap } from 'rxjs';
import { CartProduct, Product } from '../Types/Types';
import { merge ,map,scan,tap,Observable} from 'rxjs';
import { AuthService } from './auth.service';
import { addDoc, collection, doc,deleteDoc,collectionData, query, where} from '@angular/fire/firestore';
import { ProductService } from './product.service';

interface Cart{
  cartProductId:string,
  userId:string,
  docReference:string
}
@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  authService = inject(AuthService);
  productService = inject(ProductService);
  allCartItems$=this.getAllCart()
  firestore = this.authService.firestore;
  currentUser$ = this.authService.currentUser$
  fetchedProducts$ = this.productService.fetchedProducts$;
  addToCartSubject = new Subject<Product>();
  addToCartAction$ = this.addToCartSubject.asObservable();
  removeFromCartSubject = new Subject<Product>();
  removeFromCartAction$ = this.removeFromCartSubject.asObservable();
  fetchedCartItems$ = this.currentUser$.pipe(
    tap((item) => console.log(item)),
    switchMap((user) => {
      if (user) {
        return this.getCartItems(user?.userId);
      } else {
        return EMPTY;
      }
    })
  );
  addCartItem$ = this.addToCartAction$.pipe(
    combineLatestWith(this.currentUser$),
    switchMap(([product, user]) => {
    console.log(user)
      if (user !== null) {
        return this.saveCartitem(product, user.userId);
      } else {
        return EMPTY;
      }
    })
  );
  removedSavedCartItem$ = this.removeFromCartAction$.pipe(
    combineLatestWith(this.fetchedCartItems$),
    map(([itemToRemove, cartItems]) => [
      ...cartItems.filter((cartItem) => cartItem.pid == itemToRemove.pid),
    ]),
    concatMap((cartItemToRemove) => this.removeCartItem(cartItemToRemove[0]))
  );
  cartItems$ = merge(
    this.fetchedCartItems$.pipe(map(this.serverCartAddHandler)),
    this.addCartItem$.pipe(map(this.addHandler)),
    this.removedSavedCartItem$.pipe(map(this.deleteHandler))
  ).pipe(
    scan((state: CartProduct[], stateHandler) => stateHandler(state), []),
    shareReplay(1)
  );
  noOfItemsInCart$ = this.cartItems$.pipe(map((cartItems) => cartItems.length));
  addHandler() {
    return (state: CartProduct[]) => state;
  }
  deleteHandler() {
    return (state: CartProduct[]) => state;
  }
  serverCartAddHandler(products: CartProduct[]) {
    return () => [...products];
  }
  saveCartitem(product: Product, userId: string) {
    return from(
      addDoc(collection(this.firestore, 'cartItems'), {
        cartProductId: product.pid,
        userId,
      })
    );
  }
  removeCartItem(product: CartProduct) {
    return from(
      deleteDoc(doc(this.firestore, 'cartItems', product.docReference))
    );
  }
  firstCartItemsHandler(expenses: Product[]) {
    return (state: Product[]) => [...state, ...expenses];
  }
  getCartItems(userId: string): Observable<CartProduct[]> {
    const cartCollection = collection(this.firestore, 'cartItems');
    const q = query(cartCollection, where('userId', '==', userId));
    return collectionData<Cart[]>(q, { idField: 'docReference' }).pipe(
      //tap((items)=>console.log(items)),
      combineLatestWith(this.fetchedProducts$),
      map(([cartItems, products]) => {
        return cartItems.map((item: Cart) => {
          let details = products.find((currentValue: Product) => {
            return currentValue.pid == item.cartProductId;
          });
          return { ...details, docReference: item.docReference };
        });
      }),
      tap((items) => console.log(items))
    );
  }
  getAllCart():Observable<Cart[]>{
    const cartCollection = collection(this.firestore, 'cartItems');
    //const q = query(cartCollection, where('userId', '==', userId));
    return collectionData(cartCollection, { idField: 'docReference' });

  }

  constructor() {}
}
