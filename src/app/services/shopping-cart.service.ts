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
  productService=inject(ProductService)
  firestore = this.authService.firestore;
  currentUser$ = this.authService.currentUser$
  fetchedProducts$=this.productService.fetchedProducts$
  addToCartSubject = new Subject<Product>();
  addToCartAction$ = this.addToCartSubject.asObservable();
  removeFromCartSubject = new Subject<Product>();
  removeFromCartAction$ = this.removeFromCartSubject.asObservable();
  fetchedCartItems$ = this.currentUser$.pipe(
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
      if (user !== null) {
        return this.saveCartitem(product, user.userId);
      } else {
        return EMPTY;
      }
    }),
  );
  cumulativeCartAddFromServerAndLocal$ = merge(
    this.fetchedCartItems$.pipe(map(this.serverAndLocalAddHandler)),
    this.addCartItem$.pipe(map(this.addHandler))
  ).pipe(
    scan((state: CartProduct[], stateHandler) => stateHandler(state), []),
    shareReplay(1),
  );
  removedSavedCartItem$ = this.removeFromCartAction$.pipe(
    combineLatestWith(this.cumulativeCartAddFromServerAndLocal$),
    map(([itemToRemove, cartItems]) => [
      ...cartItems.filter((cartItem) => cartItem.pid == itemToRemove.pid),
    ]),
    concatMap((cartItemToRemove) => this.removeCartItem(cartItemToRemove[0]))
  );
  cartItems$ = merge(
    this.cumulativeCartAddFromServerAndLocal$.pipe(map(this.serverAndLocalAddHandler)),
    this.removedSavedCartItem$.pipe(map(this.deleteHandler))
  ).pipe(
    scan((state: CartProduct[], stateHandler) => stateHandler(state), []),
    tap((items)=>console.log(items)),
    shareReplay(1)
  );
  noOfItemsInCart$ = this.cartItems$.pipe(map((cartItems) => cartItems.length));
  addHandler(Product: CartProduct) {
    return (state: CartProduct[]) => [...state, Product];
  }
  serverAndLocalAddHandler(products:CartProduct[]){
    return (state: CartProduct[]) => [...state, ...products
    ];

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
      map((docRef) => ({ ...product, docReference: docRef.id })),
    );
  }
  removeCartItem(product: CartProduct) {
    return from(
      deleteDoc(doc(this.firestore, 'cartItems', product.docReference))
    ).pipe(map(() => product.pid));
  }
  firstCartItemsHandler(expenses: Product[]) {
    return (state: Product[]) => [...state, ...expenses];
  }
  getCartDetails(productId:string){
    const cartCollection = collection(this.firestore, 'cartItems');
    const q = query(cartCollection, where('pid', '==', productId));
    return collectionData<Product[]>(q, { idField: 'docReference' });


  }
  getCartItems(userId: string): Observable<CartProduct[]> {
    const cartCollection = collection(this.firestore, 'cartItems');
    const q = query(cartCollection, where('userId', '==', userId));
    return collectionData<Cart[]>(q,{idField:'docReference'}).pipe(
      combineLatestWith(this.fetchedProducts$),
      map(([cartItems,products])=>{
        console.log(cartItems)
        return cartItems.map((item:Cart)=>{
          let details=products.find((currentValue:Product)=>{
            return currentValue.pid==item.cartProductId
          })
          return ({...details,docReference:item.docReference})
        })
      }),
      tap((items)=>console.log(items)),


    );
  }

  constructor() {}
}
