import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRequestComponent } from './business-request.component';

describe('BusinessRequestComponent', () => {
  let component: BusinessRequestComponent;
  let fixture: ComponentFixture<BusinessRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
