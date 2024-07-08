import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoginUser} from '../../Types/Types';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormErrorSnackbarComponent } from '../form-error-snackbar/form-error-snackbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  _snackBar = inject(MatSnackBar);
  authService=inject(AuthService)
  user: LoginUser = {
    email: '',
    password: '',
  };
  hidePassword: boolean = true;
  clickPasswordHideEvent(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }
  openErrorSnackBar() {
    this._snackBar.openFromComponent(FormErrorSnackbarComponent, {
      duration: 5000,
    });
  }
  onSubmit() {
    this.authService.login(this.user).subscribe()
  }
}
