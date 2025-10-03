import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenCreateRcsCardComponent } from './screen-create-rcs-card.component';

describe('ScreenCreateRcsCardComponent', () => {
  let component: ScreenCreateRcsCardComponent;
  let fixture: ComponentFixture<ScreenCreateRcsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenCreateRcsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenCreateRcsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
