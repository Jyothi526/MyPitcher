import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPitchComponent } from './edit-pitch.component';

describe('EditPitchComponent', () => {
  let component: EditPitchComponent;
  let fixture: ComponentFixture<EditPitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPitchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
