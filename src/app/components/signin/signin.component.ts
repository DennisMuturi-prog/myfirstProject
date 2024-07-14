import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoginUser } from '../../Types/Types';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormErrorSnackbarComponent } from '../form-error-snackbar/form-error-snackbar.component';
import { AuthService } from '../../services/auth.service';
import { catchError, Subscription } from 'rxjs';
import { AuthSnackbarComponent } from '../auth-snackbar/auth-snackbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    MatProgressBarModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  _snackBar = inject(MatSnackBar);
  showProgressBar=signal(false)
  authService = inject(AuthService);
  loginUnsub!: Subscription;
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
    this.showProgressBar.set(true)
    this.loginUnsub = this.authService
      .login(this.user)
      .pipe(
        catchError((err) => {
          this.showProgressBar.set(false)
          this._snackBar.openFromComponent(AuthSnackbarComponent, {
            data: `Incorrect password/email ${err}`,
            duration: 10000,
            verticalPosition: 'top',
          });
          return [];
        })
      )
      .subscribe(() => {
        this._snackBar.open('successfully logged in!', '', {
          duration: 3000,
          verticalPosition: 'top',
        });
      });
  }
  ngOnDestroy() {
    if (this.loginUnsub) {
      this.loginUnsub.unsubscribe();
    }
  }
}
