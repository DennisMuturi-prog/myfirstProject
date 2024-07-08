import { Component, inject} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserAuth } from '../../Types/Types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule,AsyncPipe,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authService = inject(AuthService);
  currentUser$:Observable<UserAuth>=this.authService.currentUser$
  logout() {
    this.authService.logout().subscribe();
  }
}
