import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredConfigurationsComponent } from './stored-configurations.component';

describe('StoredConfigurationsComponent', () => {
  let component: StoredConfigurationsComponent;
  let fixture: ComponentFixture<StoredConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoredConfigurationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoredConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
