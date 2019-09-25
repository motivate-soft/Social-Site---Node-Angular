import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateBusinessComponent } from './private-business.component';

describe('PrivateBusinessComponent', () => {
  let component: PrivateBusinessComponent;
  let fixture: ComponentFixture<PrivateBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
