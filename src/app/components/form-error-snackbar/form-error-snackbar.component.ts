import { Component, inject } from '@angular/core';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-error-snackbar',
  standalone: true,
  imports: [MatButtonModule,MatSnackBarLabel,MatSnackBarActions,MatSnackBarAction,MatIconModule],
  templateUrl: './form-error-snackbar.component.html',
  styleUrl: './form-error-snackbar.component.css'
})
export class FormErrorSnackbarComponent {
  snackBarRef=inject(MatSnackBarRef);

}
