import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable ,startWith,map,tap} from 'rxjs';
import { ProductService } from '../../services/product.service';
import {MatSliderModule} from '@angular/material/slider'
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  productService = inject(ProductService);
  categories: string[] = [
    'all',
    'Computers',
    'Clothing and Accessories',
    'Footwear',
    'Home Furnishing',
    'Home Decor',
    'Bags, Wallets & Belts',
    'Home & Kitchen',
    'Kitchen, Cookware & Serveware',
    'Toys and Games',
    'Health Care',
    'Beauty and Grooming',
    'Mobiles & Accessories',
    'Food Products',
    'Kids Accessories',
    'Home Lighting',
  ];
  categoryControl = new FormControl('');
  priceLowerControl=new FormControl('1')
  priceUpperControl=new FormControl('2000')
  filteredOptions!: Observable<string[]>;
  ngOnInit() {
    this.filteredOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categories.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  handleCategorySelect(category: MatAutocompleteSelectedEvent) {
    this.productService.selectCategorySubject.next(category.option.value);
  }
  handlePriceFilter(){
    this.productService.priceRangeSubject.next({
      lower:Number(this.priceLowerControl.value),
      upper:Number(this.priceUpperControl.value)
    })

  }
}
