import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CheckoutService } from '../../services/checkout.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';

interface Order {
  orderId: string,
  totalPrice: number
}

@Component({
  selector: 'app-mpesa-payment-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './mpesa-payment-dialog.component.html',
  styleUrl: './mpesa-payment-dialog.component.css',
})
export class MpesaPaymentDialogComponent {
  PhoneNumberRegx: RegExp = /^(?:(?:\+|00)254|0)(?:7\d{8}|1\d{8})$/;

  checkOutService = inject(CheckoutService);
  readonly orderDetails: Order = inject(MAT_DIALOG_DATA);
  phoneNumber = new FormControl('', [Validators.required,Validators.pattern(this.PhoneNumberRegx)]);
  readonly dialogRef = inject(MatDialogRef<MpesaPaymentDialogComponent>);
  onNoClick(): void {
    this.dialogRef.close();
  }
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openSnackBar(error_message:string) {
    this._snackBar.openFromComponent(ErrorSnackBarComponent, {
      data:error_message,
      duration: this.durationInSeconds * 1000,
      verticalPosition:'top'
    });
  }
  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log("error is " ,err)
      errorMessage = `${err.error.errMessage}`;
    }
    this.openSnackBar(errorMessage)
  }
  onPayment(): void {
    const phoneNo = this.phoneNumber.value
    if (phoneNo) {
      this.checkOutService.initiateMpesaPayment(this.orderDetails.orderId, phoneNo).subscribe({
        next:() => {
        this.dialogRef.close()
      },
      error:(err)=>{
        this.handleError(err)
        
      }
      })
    }
  }
}
