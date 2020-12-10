import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPitchComponent } from './new-pitch.component';

describe('NewPitchComponent', () => {
  let component: NewPitchComponent;
  let fixture: ComponentFixture<NewPitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPitchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
