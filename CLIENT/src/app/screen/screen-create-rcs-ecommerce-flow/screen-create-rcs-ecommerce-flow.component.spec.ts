import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenCreateRcsEcommerceFlowComponent } from './screen-create-rcs-ecommerce-flow.component';

describe('ScreenCreateRcsEcommerceFlowComponent', () => {
  let component: ScreenCreateRcsEcommerceFlowComponent;
  let fixture: ComponentFixture<ScreenCreateRcsEcommerceFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenCreateRcsEcommerceFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenCreateRcsEcommerceFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
