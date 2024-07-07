import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogcropperComponent } from './dialogcropper.component';

describe('DialogcropperComponent', () => {
  let component: DialogcropperComponent;
  let fixture: ComponentFixture<DialogcropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogcropperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogcropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
