import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenHomeComponent } from './screen-home.component';

describe('ScreenHomeComponent', () => {
  let component: ScreenHomeComponent;
  let fixture: ComponentFixture<ScreenHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
