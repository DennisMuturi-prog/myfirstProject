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

  constructor() {}
}
