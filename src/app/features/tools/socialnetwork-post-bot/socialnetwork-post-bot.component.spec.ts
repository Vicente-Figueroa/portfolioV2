import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialnetworkPostBotComponent } from './socialnetwork-post-bot.component';

describe('SocialnetworkPostBotComponent', () => {
  let component: SocialnetworkPostBotComponent;
  let fixture: ComponentFixture<SocialnetworkPostBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialnetworkPostBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialnetworkPostBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
