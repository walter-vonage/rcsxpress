import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommercePreviewComponent } from './ecommerce-preview.component';

describe('EcommercePreviewComponent', () => {
  let component: EcommercePreviewComponent;
  let fixture: ComponentFixture<EcommercePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcommercePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcommercePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
