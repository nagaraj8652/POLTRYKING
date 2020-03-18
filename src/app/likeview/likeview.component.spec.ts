import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LikeviewComponent } from './likeview.component';

describe('LikeviewComponent', () => {
  let component: LikeviewComponent;
  let fixture: ComponentFixture<LikeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LikeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
