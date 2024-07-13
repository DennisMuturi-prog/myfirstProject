import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserAuth } from '../../Types/Types';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProoductService } from '../../services/prooduct.service';
import { ProductComponent } from '../product/product.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from '../side-nav/side-nav.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

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
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authService = inject(AuthService);
  productService = inject(ProoductService);
  products$ = this.productService.productsWithPriceAndCategoryFilter$;
  currentUser$: Observable<UserAuth> = this.authService.currentUser$;
  logout() {
    this.authService.logout().subscribe();
  }
}
