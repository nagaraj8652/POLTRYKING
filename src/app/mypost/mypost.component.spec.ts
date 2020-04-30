import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MypostComponent } from './mypost.component';

describe('MypostComponent', () => {
  let component: MypostComponent;
  let fixture: ComponentFixture<MypostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypostComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MypostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
