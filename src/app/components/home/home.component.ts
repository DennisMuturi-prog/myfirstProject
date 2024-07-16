import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserAuth } from '../../Types/Types';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../product/product.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from '../side-nav/side-nav.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { SearchComponent } from '../search/search.component';
import {MatChipsModule} from '@angular/material/chips'
import {MatBadgeModule} from '@angular/material/badge'
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    AsyncPipe,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    AsyncPipe,
    ProductComponent,
    MatSidenavModule,
    SideNavComponent,
    MatProgressSpinnerModule,
    SearchComponent,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authService = inject(AuthService);
  productService = inject(ProductService);
  cartService=inject(ShoppingCartService)
  noOfCartItems$=this.cartService.noOfItemsInCart$
  products$ = this.productService.products$;
  filterChips$=this.productService.filterChips$
  currentUser$: Observable<UserAuth | null> = this.authService.currentUser$;
  logout() {
    this.authService.logout().subscribe();
  }
  removeFilterChip(chip:string){
    this.productService.removeFilterChipsSubject.next(chip)
  }
}
