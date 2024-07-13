import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { collection, collectionData } from '@angular/fire/firestore';
import { Product } from '../Types/Types';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Injectable({
  providedIn: 'root',
})
export class ProoductService {
  authService = inject(AuthService);
  products$ = this.getProducts();
  selectCategorySubject = new BehaviorSubject<string>('');
  selectCategoryAction$ = this.selectCategorySubject.asObservable();
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
    })
  );
  constructor() {}
}
