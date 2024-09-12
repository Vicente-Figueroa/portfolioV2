import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotEcommerceComponent } from './chatbot-ecommerce.component';

describe('ChatbotEcommerceComponent', () => {
  let component: ChatbotEcommerceComponent;
  let fixture: ComponentFixture<ChatbotEcommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotEcommerceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
