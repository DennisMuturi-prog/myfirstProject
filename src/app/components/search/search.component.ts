import { Component, inject } from '@angular/core';
import { ReactiveFormsModule,FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatInputModule,MatButtonModule,MatFormFieldModule,ReactiveFormsModule,MatIconModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  productService=inject(ProductService)
  searchControl=new FormControl('')
  onSearch(){
    if(this.searchControl.value){
      this.productService.searchSubject.next(this.searchControl.value.toLowerCase())
    }
  }

}
