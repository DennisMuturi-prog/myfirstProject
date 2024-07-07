import { ChangeDetectionStrategy, Component,inject,signal } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterLink ,Router} from '@angular/router';
import { confirmPasswordValidator } from './confirm-password.validator';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormErrorSnackbarComponent } from '../form-error-snackbar/form-error-snackbar.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  providers:[provideNativeDateAdapter()],
  imports: [ReactiveFormsModule,MatCardModule,MatButtonModule,MatIconModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    RouterLink
  ],
  changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
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
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      marketingSource: new FormControl('', Validators.required),
      acceptTerms: new FormControl('', Validators.required),
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
  _snackBar=inject(MatSnackBar)
  authService = inject(AuthService);
  router = inject(Router);
  hidePassword = signal(true);
  clickPasswordHideEvent(event: MouseEvent) {
    this.hidePassword.update((previous) => !previous);
    event.stopPropagation();
  }
  onSubmit() {
    this.authService.register(this.signupForm.value).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
  openErrorSnackBar(){
    this._snackBar.openFromComponent(FormErrorSnackbarComponent,{
      duration:5000
    })
  }
  onReactiveSubmit(){
    console.log(this.signupForm.value)
  }

}
