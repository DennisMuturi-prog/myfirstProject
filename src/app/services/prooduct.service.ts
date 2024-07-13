import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { collection, collectionData } from '@angular/fire/firestore';
import { Product, Slidervalue } from '../Types/Types';
import { BehaviorSubject, combineLatestWith, map, Observable, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ProoductService {
  authService = inject(AuthService);
  products$ = this.getProducts();
  selectCategorySubject = new BehaviorSubject<string>('');
  selectCategoryAction$ = this.selectCategorySubject.asObservable();
  priceRangeSubject=new BehaviorSubject<Slidervalue>({lower:1,upper:2000})
  priceRangeAction$=this.priceRangeSubject.asObservable()
  getProducts(): Observable<Product[]> {
    const productCollection = collection(
      this.authService.firestore,
      'products'
    );
    console.log('fetch');
    return collectionData<Product[]>(productCollection);
  }
  selectCategoryProducts$ = this.selectCategoryAction$.pipe(
    combineLatestWith(this.products$),
    map(([category, products]) => {
      if (!category) {
        return products;
      } else if (category == 'all') {
        return products;
      } else {
        return products.filter((product) => product.category == category);
      }
    }),
  );
  productsWithPriceAndCategoryFilter$=this.priceRangeAction$.pipe(
    combineLatestWith(this.selectCategoryProducts$),
    map(([priceRange,products])=>products.filter((product)=>product.price>=priceRange.lower&&product.price<=priceRange.upper))
  )
  constructor() {}
}
