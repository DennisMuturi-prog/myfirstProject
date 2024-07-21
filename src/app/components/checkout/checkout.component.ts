import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink,MatToolbarModule,MatButtonModule,MatFormFieldModule,MatInputModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

}
