import { CommonModule } from '@angular/common';
import { Component,input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule,MatCardModule,CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css',
})
export class StarRatingComponent {
  averageRating=input.required<number>()
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
