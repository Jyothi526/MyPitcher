import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePitchComponent } from './share-pitch.component';

describe('SharePitchComponent', () => {
  let component: SharePitchComponent;
  let fixture: ComponentFixture<SharePitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharePitchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
