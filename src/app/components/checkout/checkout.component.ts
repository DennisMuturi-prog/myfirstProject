import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { addressMap } from './address';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatRadioModule,
    MatSelectModule,
    AsyncPipe
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  myAddressMap = addressMap;
  checkOutForm = new FormGroup({
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      county: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
    }),
    deliveryForm: new FormGroup({
      typeOfDelivery: new FormControl('', Validators.required),
    }),
    paymentForm: new FormGroup({
      modeOfPayment: new FormControl('', Validators.required),
    }),
  });
  get county() {
    return this.checkOutForm.get('address.county');
  }
  get city() {
    return this.checkOutForm.get('address.city');
  }
  get street() {
    return this.checkOutForm.get('address.street');
  }
  get zip() {
    return this.checkOutForm.get('address.zip');
  }
  get address() {
    return this.checkOutForm.get('address') as FormGroup;
  }
  get deliveryForm() {
    return this.checkOutForm.get('deliveryForm') as FormGroup;
  }
  get paymentForm() {
    return this.checkOutForm.get('paymentForm') as FormGroup;
  }
  get typeOfDelivery() {
    return this.checkOutForm.get('deliveryForm.typeOfDelivery');
  }
  get modeOfPayment() {
    return this.checkOutForm.get('paymentForm.modeOfPayment');
  }
  cities$: Observable<string[] | undefined> | undefined =
    this.county?.valueChanges.pipe(
      map((countyName) =>
        countyName ? this.myAddressMap.get(countyName) : ['Ex']
      )
    );
  onSubmit() {}
}
