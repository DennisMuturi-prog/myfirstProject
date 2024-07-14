import { AbstractControl, ValidationErrors } from '@angular/forms';

export function genderPicked(
  control: AbstractControl
): ValidationErrors | null {
  return control.value? null : { pickGender: true };
}
