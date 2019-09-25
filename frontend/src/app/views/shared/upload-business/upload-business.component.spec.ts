import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBusinessComponent } from './upload-business.component';

describe('UploadBusinessComponent', () => {
  let component: UploadBusinessComponent;
  let fixture: ComponentFixture<UploadBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
