import { AbstractControl, ValidationErrors } from "@angular/forms";

export function mustBeChecked(control: AbstractControl): ValidationErrors | null {
  return control.value === true ? null : { 'mustBeChecked': true };
}