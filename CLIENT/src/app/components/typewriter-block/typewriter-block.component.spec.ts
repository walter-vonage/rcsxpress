import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypewriterBlockComponent } from './typewriter-block.component';

describe('TypewriterBlockComponent', () => {
  let component: TypewriterBlockComponent;
  let fixture: ComponentFixture<TypewriterBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypewriterBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypewriterBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
