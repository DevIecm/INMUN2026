import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEvaluacionesComponent } from './form-evaluaciones.component';

describe('FormEvaluacionesComponent', () => {
  let component: FormEvaluacionesComponent;
  let fixture: ComponentFixture<FormEvaluacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEvaluacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
