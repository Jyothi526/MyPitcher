import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitcherformComponent } from './pitcherform.component';

describe('PitcherformComponent', () => {
  let component: PitcherformComponent;
  let fixture: ComponentFixture<PitcherformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PitcherformComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitcherformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
