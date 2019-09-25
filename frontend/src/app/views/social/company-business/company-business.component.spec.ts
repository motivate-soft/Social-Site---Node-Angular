import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBusinessComponent } from './company-business.component';

describe('CompanyBusinessComponent', () => {
  let component: CompanyBusinessComponent;
  let fixture: ComponentFixture<CompanyBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
