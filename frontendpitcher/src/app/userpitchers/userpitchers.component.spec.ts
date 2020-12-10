import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpitchersComponent } from './userpitchers.component';

describe('UserpitchersComponent', () => {
  let component: UserpitchersComponent;
  let fixture: ComponentFixture<UserpitchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserpitchersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpitchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
