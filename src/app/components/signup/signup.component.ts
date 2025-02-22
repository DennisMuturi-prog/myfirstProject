import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { confirmPasswordValidator } from './confirm-password.validator';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormErrorSnackbarComponent } from '../form-error-snackbar/form-error-snackbar.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { catchError, Subscription } from 'rxjs';
import { AuthSnackbarComponent } from '../auth-snackbar/auth-snackbar.component';
import { mustBeChecked } from './acceptTerms.validator';
import { genderPicked } from './genderPick.validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    RouterLink,
    MatProgressBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  signupForm = new FormGroup(
    {
      firstName: new FormControl('', Validators.required),
      secondName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.StrongPasswordRegx),
      ]),
      confirmPassword: new FormControl('', Validators.required),
      gender: new FormControl('', [Validators.required,genderPicked]),
      dateOfBirth: new FormControl('', Validators.required),
      marketingSource: new FormControl('', Validators.required),
      acceptTerms: new FormControl('', [Validators.required,mustBeChecked]),
    },
    { validators: confirmPasswordValidator }
  );
  get firstName() {
    return this.signupForm.get('firstName');
  }
  get secondName() {
    return this.signupForm.get('secondName');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  get gender() {
    return this.signupForm.get('gender');
  }
  get dateOfBirth() {
    return this.signupForm.get('dateOfBirth');
  }
  get marketingSource() {
    return this.signupForm.get('marketingSource');
  }
  get acceptTerms() {
    return this.signupForm.get('acceptTerms');
  }
  _snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  hidePassword = signal(true);
  showProgressBar=signal(false)
  signUpUnsub!: Subscription;
  clickPasswordHideEvent(event: MouseEvent) {
    this.hidePassword.update((previous) => !previous);
    event.stopPropagation();
  }
  onSubmit() {
    this.showProgressBar.set(true)
    const {
      firstName,
      secondName,
      email,
      password,
      dateOfBirth,
      gender,
      marketingSource,
    } = this.signupForm.value;
    if (
      firstName &&
      secondName &&
      email &&
      password &&
      dateOfBirth &&
      gender &&
      marketingSource
    ) {
      const registeredUser = {
        firstName,
        secondName,
        email,
        password,
        dateOfBirth,
        gender,
        marketingSource,
      };
      this.signUpUnsub = this.authService
        .register(registeredUser)
        .pipe(
          catchError((err) => {
            this.showProgressBar.set(false)
            this._snackBar.openFromComponent(AuthSnackbarComponent, {
              data:err,
              duration: 10000,
            });
            return [];
          })
        )
        .subscribe(() => {
          this._snackBar.open('sign up successful', '', {
            duration: 3000,
            verticalPosition: 'top',
          });
        });
    }
  }
  openErrorSnackBar() {
    this._snackBar.openFromComponent(FormErrorSnackbarComponent, {
      duration: 5000,
    });
  }
  ngOnDestroy() {
    if (this.signUpUnsub) {
      this.signUpUnsub.unsubscribe();
    }
  }
}
