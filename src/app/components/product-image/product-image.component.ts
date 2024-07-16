import { Component, computed, inject, input } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  distinctUntilChanged,
  from,
  concatMap,
  of,
  delay,
  map,
  switchMap,
} from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.css',
})
export class ProductImageComponent {
  sanitizer = inject(DomSanitizer);
  productImagesUrls = input<string[]>([]);
  imagesWithoutFirstUrl = computed(() => {
    let imageUrls = [...this.productImagesUrls()];
    imageUrls.shift();
    return imageUrls;
  });
  slideImages$!: Observable<SafeUrl>;
  private hoverSubject = new BehaviorSubject(2);
  private hoverAction$ = this.hoverSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  ngOnInit() {
    this.slideImages$ = from(this.imagesWithoutFirstUrl()).pipe(
      concatMap((url) =>
        of(url).pipe(
          delay(1000),
          map((url) => this.sanitizer.bypassSecurityTrustUrl(url))
        )
      )
    );
  }

  images$: Observable<SafeUrl> = this.hoverAction$.pipe(
    switchMap((streamType: number) => {
      if (streamType == 2) {
        return of(
          this.sanitizer.bypassSecurityTrustUrl(this.productImagesUrls()[0])
        );
      } else {
        return this.slideImages$;
      }
    })
  );
  slideShow() {
    this.hoverSubject.next(1);
  }
  resetSlideShow() {
    this.hoverSubject.next(2);
  }
}
