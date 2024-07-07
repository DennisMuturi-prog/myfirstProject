import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilepictureComponent } from './profilepicture.component';

describe('ProfilepictureComponent', () => {
  let component: ProfilepictureComponent;
  let fixture: ComponentFixture<ProfilepictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilepictureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilepictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
