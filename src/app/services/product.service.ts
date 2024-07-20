import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { collection, collectionData,query,where } from '@angular/fire/firestore';
import { Product, Slidervalue,ServerProduct } from '../Types/Types';
import { Cart } from './shopping-cart.service';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  switchMap,
  merge,
  scan,
  Subject,
  tap,
  combineLatestWith,
  EMPTY
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;
  firestore = this.authService.firestore;
  userFetchedCartItems$: Observable<Cart[]> = this.currentUser$.pipe(
    switchMap((user) => {
      if (user) {
        return this.getCartItems(user?.userId);
      } else {
        return EMPTY;
      }
    }),
    shareReplay(1)
  );
  fetchedCartSet$: Observable<Map<string, Cart>> =
    this.userFetchedCartItems$.pipe(
      map((cartGoods) => {
        const cartGoodsMap = new Map<string, Cart>();
        cartGoods.forEach((good) => {
          cartGoodsMap.set(good.cartProductId, good);
        });
        return cartGoodsMap;
      }),
      shareReplay(1)
    );
  fetchedProducts$: Observable<Product[]> = this.getProducts().pipe(
    //tap(items=>console.log(items)),
    combineLatestWith(this.fetchedCartSet$),
    //tap(([cart,good])=>console.log(good)),
    map(([products, cartGoods]) =>
      products.map((product) => ({
        ...product,
        inCart: cartGoods.has(product.pid),
      }))
    ),
  );
  getCartItems(userId: string): Observable<Cart[]> {
    const collectionRef = collection(this.firestore, 'cartItems');
    const userQuery = query(collectionRef, where('userId', '==', userId));
    return collectionData(userQuery, { idField: 'id' });
  }
  selectCategorySubject = new BehaviorSubject<string>('all');
  selectCategorySubject$ = this.selectCategorySubject
    .asObservable()
    .pipe(shareReplay(1));
  selectCategoryAction$ = this.selectCategorySubject$;
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
  productsByCategory$: Observable<Map<string, Product[]>> =
    this.fetchedProducts$.pipe(
      map((products) => {
        const productsByCategory = new Map<string, Product[]>();
        productsByCategory.set('all', [...products]);
        products.forEach((product) => {
          if (!productsByCategory.has(product.category)) {
            productsByCategory.set(product.category, [product]);
          } else {
            productsByCategory.get(product.category)?.push(product);
          }
        });
        return productsByCategory;
      })
    );
  getProducts(): Observable<ServerProduct[]> {
    const productCollection = collection(
      this.authService.firestore,
      'products'
    );
    return collectionData<ServerProduct[]>(productCollection);
  }
  categoryHandler(category: string) {
    if (category == '' || category == 'all') {
      return (state: Product[]) => state;
    }
    return (state: Product[]) => [
      ...state.filter((product) => product.category == category),
    ];
  }
  searchHandler(searchTerm: string) {
    if (searchTerm == '') {
      return (state: Product[]) => state;
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
      return (state: Product[]) => state;
    }
    return (state: Product[]) => [
      ...state.filter(
        (product) =>
          product.price >= priceRange.lower && product.price <= priceRange.upper
      ),
    ];
  }

  categoryProducts$ = this.selectCategoryAction$.pipe(
    combineLatestWith(this.productsByCategory$),
    map(([category, productsWithCategory]) =>
      productsWithCategory.get(category)
    ),
  );
  priceProducts$ = this.priceRangeAction$.pipe(
    switchMap((changeFunction) => {
      return this.categoryProducts$.pipe(
        map((products) => changeFunction(products || []))
      );
    })
  );
  products$ = this.searchAction$.pipe(
    switchMap((changeFunction) => {
      return this.priceProducts$.pipe(
        map((products) => changeFunction(products))
      );
    }),
  );
  chipsHandler(value: Slidervalue) {
    if (value.lower == 1 && value.upper == 2000) {
      return (state: string[]) => state;
    }
    return (state: string[]) => [
      ...state.filter((chip) => !chip.includes('lowest')),
      `lowest:$${value.lower} | highest:$${value.upper}`,
    ];
  }
  chipsSearch(value: string) {
    if (value == '') {
      return (state: string[]) => state;
    }
    return (state: string[]) => [
      ...state.filter((chip) => !chip.includes('search')),
      `search:${value}`,
    ];
  }
  chipsCategory(value: string) {
    if (value == 'all') {
      return (state: string[]) => state;
    }
    return (state: string[]) => [
      ...state.filter((chip) => !chip.includes('category')),
      `category:${value}`,
    ];
  }
  removeChipsHandler(value: string) {
    return (state: string[]) => [...state.filter((chip) => chip !== value)];
  }
  removeFilterChipsSubject = new Subject<string>();
  removeChipsAction$ = this.removeFilterChipsSubject.asObservable().pipe(
    tap((value) => {
      let myFilterOptions = value.split(':');
      if (myFilterOptions[0] == 'category') {
        this.selectCategorySubject.next('all');
      } else if (myFilterOptions[0] == 'search') {
        this.searchSubject.next('');
      } else if (myFilterOptions[0] == 'lowest') {
        this.priceRangeSubject.next({ lower: 1, upper: 2000 });
      }
    })
  );
  filterChips$ = merge(
    this.searchSubject$.pipe(map(this.chipsSearch)),
    this.selectCategorySubject$.pipe(map(this.chipsCategory)),
    this.priceRangeSubject$.pipe(map(this.chipsHandler)),
    this.removeChipsAction$.pipe(map(this.removeChipsHandler))
  ).pipe(scan((acc: string[], stateHandler) => stateHandler(acc), []));

  constructor() {}
}
