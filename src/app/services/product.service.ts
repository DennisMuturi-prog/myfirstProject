import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { collection, collectionData } from '@angular/fire/firestore';
import { Product, Slidervalue } from '../Types/Types';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  switchMap,
  merge,
  scan
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  authService = inject(AuthService);
  fetchedProducts$ = this.getProducts();
  selectCategorySubject = new BehaviorSubject<string>('');
  selectCategorySubject$ = this.selectCategorySubject
    .asObservable()
    .pipe(shareReplay(1));
  selectCategoryAction$ = this.selectCategorySubject$.pipe(
    map(this.categoryHandler)
  );
  priceRangeSubject = new BehaviorSubject<Slidervalue>({
    lower: 1,
    upper: 2000,
  });
  priceRangeSubject$ = this.priceRangeSubject
    .asObservable()
    .pipe(shareReplay(1));
  priceRangeAction$ = this.priceRangeSubject$.pipe(map(this.priceHandler));
  searchSubject = new BehaviorSubject<string>('');
  searchSubject$ = this.searchSubject.asObservable().pipe(shareReplay(1));
  searchAction$ = this.searchSubject$.pipe(map(this.searchHandler));
  getProducts(): Observable<Product[]> {
    const productCollection = collection(
      this.authService.firestore,
      'products'
    );
    console.log('fetch');
    return collectionData<Product[]>(productCollection);
  }
  categoryHandler(category: string) {
    if (category == '' || category == 'all') {
      return (state: Product[]) => [...state];
    }
    return (state: Product[]) => [
      ...state.filter((product) => product.category == category),
    ];
  }
  searchHandler(searchTerm: string) {
    if (searchTerm == '') {
      return (state: Product[]) => [...state];
    }
    return (state: Product[]) => [
      ...state.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm)
      ),
    ];
  }
  priceHandler(priceRange: Slidervalue) {
    if (priceRange.lower == 1 && priceRange.upper == 2000) {
      return (state: Product[]) => [...state];
    }
    return (state: Product[]) => [
      ...state.filter(
        (product) =>
          product.price >= priceRange.lower && product.price <= priceRange.upper
      ),
    ];
  }

  categoryProducts$ = this.selectCategoryAction$.pipe(
    switchMap((changeFunction) => {
      return this.fetchedProducts$.pipe(
        map((products) => changeFunction(products))
      );
    })
  );
  priceProducts$ = this.priceRangeAction$.pipe(
    switchMap((changeFunction) => {
      return this.categoryProducts$.pipe(
        map((products) => changeFunction(products))
      );
    })
  );
  products$ = this.searchAction$.pipe(
    switchMap((changeFunction) => {
      return this.priceProducts$.pipe(
        map((products) => changeFunction(products))
      );
    })
  );
  chipsHandler(value: Slidervalue) {
    if(value.lower==1&&value.upper==2000){
      return (state: string[]) => state
    }
    return (state: string[]) => [
      ...state,
      `lowest: $${value.lower}`,
      `highest: $${value.upper}`,
    ];
   
  }
  chipsCategorySearch(value:string){
    if(value==''){
      return (state: string[]) => state;
    }
     return (state: string[]) => [
       ...state,
       value
     ];

  }
  filterChips$ = merge(
    this.searchSubject$.pipe(map(this.chipsCategorySearch)),
    this.selectCategorySubject$.pipe(map(this.chipsCategorySearch)),
    this.priceRangeSubject$.pipe(map(this.chipsHandler))
  ).pipe(
    scan((acc:string[], stateHandler) =>stateHandler(acc),[])
  );

  constructor() {}
}
