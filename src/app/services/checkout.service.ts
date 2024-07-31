import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  setDoc,
} from '@angular/fire/firestore';
import {
  combineLatestWith,
  map,
  EMPTY,
  from,
  Observable,
  Subject,
  switchMap,
  of,
  tap,
} from 'rxjs';
import { AuthService } from './auth.service';
import { ShoppingCartService } from './shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MpesaPaymentDialogComponent } from '../components/mpesa-payment-dialog/mpesa-payment-dialog.component';

interface Order {
  productId: string;
  quantity: number;
}
interface ShippingInfo {
  county: string;
  city: string;
  street: string;
  zip: string;
}
interface OrderDetails {
  addressInfo: ShippingInfo;
  deliveryMethod: string;
  modeOfPayment: string;
}
interface StripeResponse {
  url: string;
}
interface StripeUrl {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  readonly dialog = inject(MatDialog);
  router = inject(Router);
  http = inject(HttpClient);
  authService = inject(AuthService);
  shoppingCartService = inject(ShoppingCartService);
  cart$ = this.shoppingCartService.cartWithQuantityChanging$;
  totalPrice$=this.cart$.pipe(
    map((cartItems)=>cartItems.reduce((acc,curr)=>acc+curr.quantity*curr.price,0))
  )
  firestore = this.authService.firestore;
  currentUser$ = this.authService.currentUser$;
  orderGoods = new Subject<OrderDetails>();
  orderGoodsAction$ = this.orderGoods.asObservable();
  createOrder$ = this.currentUser$.pipe(
    combineLatestWith(this.cart$, this.orderGoodsAction$,this.totalPrice$),
    switchMap(([user, cartGoods, orderDetails,totalPrice]) => {
      if (user) {
        let myOrder: Order[] = cartGoods.map((good) => ({
          productId: good.pid,
          quantity: good.quantity,
        }));
        return this.addOrderItems(
          myOrder,
          user.userId,
          orderDetails.deliveryMethod
        ).pipe(
          tap((ref) => console.log(ref)),
          switchMap((orderRef) => {
            if (orderDetails.modeOfPayment == 'Credit card') {
              return this.initiateStripePayment(orderRef.id);
            } else {
              this.openDialog(orderRef.id,totalPrice);
              return of('no action');
            }
          }),
          switchMap(() =>
            this.saveUsershippingInfo(orderDetails.addressInfo, user.userId)
          )
        );
      } else {
        return EMPTY;
      }
    })
  );
  addOrderItems(
    products: Order[],
    userId: string,
    delivery: string
  ): Observable<DocumentReference> {
    return from(
      addDoc(collection(this.firestore, 'orders'), {
        userId,
        orderItems: products,
        paid: false,
        delivery,
      })
    );
  }
  //updateUserShippingAddress$ = this.currentUser$.pipe();
  saveUsershippingInfo(shippingInfo: ShippingInfo, userId: string) {
    const { county, city, street, zip } = shippingInfo;
    const userRef = doc(this.authService.firestore, `users/${userId}`);
    return from(
      setDoc(
        userRef,
        {
          county,
          city,
          street,
          zipCode: zip,
        },
        { merge: true }
      )
    );
  }
  initiateStripePayment(orderId: string):Observable<StripeUrl> {
    return this.http
      .post<StripeResponse>('http://localhost:3000/stripePayment', { orderId })
      .pipe(tap((res: StripeUrl) => (window.location.href = res.url)));
  }
  openDialog(orderId: string,totalPrice:number): void {
    this.dialog.open(MpesaPaymentDialogComponent, {
      data:{orderId,totalPrice},
      width: '500px',
      height:'400px'
    });
  }
  initiateMpesaPayment(orderId:string,phoneNumber:string){
    return this.http
      .post('http://localhost:3000/mpesa', {orderId,phoneNumber })
      .pipe(tap(() => this.router.navigate(['home'])));

  }

  constructor() {}
}
