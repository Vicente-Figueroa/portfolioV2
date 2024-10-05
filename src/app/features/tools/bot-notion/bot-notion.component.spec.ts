import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotNotionComponent } from './bot-notion.component';

describe('BotNotionComponent', () => {
  let component: BotNotionComponent;
  let fixture: ComponentFixture<BotNotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotNotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotNotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
