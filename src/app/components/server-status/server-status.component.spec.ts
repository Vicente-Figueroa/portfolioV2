import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerStatusComponent } from './server-status.component';

describe('ServerStatusComponentComponent', () => {
  let component: ServerStatusComponentComponent;
  let fixture: ComponentFixture<ServerStatusComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerStatusComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerStatusComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
