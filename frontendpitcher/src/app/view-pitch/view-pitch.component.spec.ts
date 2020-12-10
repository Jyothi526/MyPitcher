import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPitchComponent } from './view-pitch.component';

describe('ViewPitchComponent', () => {
  let component: ViewPitchComponent;
  let fixture: ComponentFixture<ViewPitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPitchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
