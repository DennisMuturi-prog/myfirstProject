import { Component, inject, Input, signal } from '@angular/core';
import { Product } from '../../Types/Types';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import {
  BehaviorSubject,
  concatMap,
  distinctUntilChanged,
  from,
  map,
  Observable,
  of,
  switchMap,
  timer,
} from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    AsyncPipe,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  sanitizer = inject(DomSanitizer);
  @Input() product!: Product;
  images$!: Observable<SafeUrl>;
  slideImages$!: Observable<SafeUrl>;
  private hoverSubject = new BehaviorSubject(2);
  private hoverAction$ = this.hoverSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  ngOnInit(): void {
    if (this.product && this.product.images) {
      const filteredUrls=[...this.product.images]
      filteredUrls.shift()
      this.slideImages$ = from(filteredUrls).pipe(
        concatMap((url) =>
          timer(1000).pipe(
            map(() => this.sanitizer.bypassSecurityTrustUrl(url))
          )
        )
      );
      this.images$ = this.hoverAction$.pipe(
        switchMap((streamType: number) => {
          if (streamType == 2) {
            return of(
              this.sanitizer.bypassSecurityTrustUrl(this.product.images[0])
            );
          } else {
            return this.slideImages$
          }
        })
      );
    }
  }
  slideShow() {
    this.hoverSubject.next(1);
  }
  resetSlideShow() {
    this.hoverSubject.next(2);
  }

  // In your ProductComponent class
  getRatingArray(rating: number): any[] {
    return new Array(Math.floor(rating));
  }

  // In your ProductComponent class
  getRatingWidth(rating: number): number {
    return (rating % 1) * 100;
  }

  // In your ProductComponent class
  getEmptyStars(rating: number): Array<any> {
    return new Array(5 - Math.ceil(rating));
  }

  // In your ProductComponent class
  getRatingStyle(rating: number): any {
    return {
      position: 'absolute',
      top: '0',
      left: '0',
      width: `${this.getRatingWidth(rating)}%`,
      overflow: 'hidden',
      height: '100%',
    };
  }
}
