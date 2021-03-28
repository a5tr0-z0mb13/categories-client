import { Component, DebugElement, OnInit, Renderer2 } from '@angular/core';
import { async, getTestBed, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatRipple, MatRippleModule, RippleRef } from '@angular/material';
import { By } from '@angular/platform-browser';

import { DraggableDirective } from './draggable.directive';
import { DropEvent } from './drop.event';

@Component({
  template: `
    <div appDraggable (dropped)="dropped($event)" [attr.data-id]="1">
      <span>One</span>
    </div>
    <div appDraggable (dropped)="dropped($event)" [attr.data-id]="2">
      <span>Two</span>
    </div>
  `
})
export class TestComponent implements OnInit {
  ngOnInit() {}

  public dropped(event: DropEvent) {
  }
}

describe('draggableDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let dropped: jasmine.Spy;
  let debugElement: DebugElement;

  let renderer: Renderer2;
  let addClass: jasmine.Spy;
  let removeClass: jasmine.Spy;

  let rippleRef: RippleRef;
  let fadeOut: jasmine.Spy;

  let ripple: MatRipple;
  let launch: jasmine.Spy;
  let fadeOutAll: jasmine.Spy;

  let dataTransfer: any;
  let getData: jasmine.Spy;
  let setData: jasmine.Spy;

  let event: any;

  let preventDefault: jasmine.Spy;
  let stopPropagation: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DraggableDirective,
        TestComponent
      ],
      imports: [
        MatRippleModule
      ]
    }).compileComponents().then(() => {
      const testBed = getTestBed();

      fixture = testBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      dropped = spyOn(component, 'dropped');

      fixture.detectChanges();

      debugElement = fixture.debugElement.query(By.directive(DraggableDirective));

      renderer = debugElement.injector.get(Renderer2);
      addClass = spyOn(renderer, 'addClass');
      removeClass = spyOn(renderer, 'removeClass');

      rippleRef = new RippleRef(null, null, null);
      fadeOut = spyOn(rippleRef, 'fadeOut');

      ripple = debugElement.injector.get(MatRipple);
      launch = spyOn(ripple, 'launch').and.returnValue(rippleRef);
      fadeOutAll = spyOn(ripple, 'fadeOutAll');

      const htmlElement: HTMLElement = <HTMLElement>{ dataset: <DOMStringMap>{ 'id': 'foo' } };

      dataTransfer = {
        getData: () => {},
        setData: () => {}
      };

      getData = spyOn(dataTransfer, 'getData').and.returnValue('bar');
      setData = spyOn(dataTransfer, 'setData');

      event = {
        clientX: 123,
        clientY: 456,
        currentTarget: htmlElement,
        dataTransfer: dataTransfer,
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      preventDefault = spyOn(event, 'preventDefault');
      stopPropagation = spyOn(event, 'stopPropagation');
    });
  }));

  describe('onDragStart', () => {
    it('should add a class to the element, disable ripples and set the data transfer attributes', () => {
      debugElement.triggerEventHandler('dragstart', event);
      expect(addClass).toHaveBeenCalledWith(event.currentTarget, 'dragging');
      expect(ripple.disabled).toBeTruthy();
      expect(event.dataTransfer.dropEffect).toEqual('move');
      expect(event.dataTransfer.effectAllowed).toEqual('move');
      expect(setData).toHaveBeenCalledWith('id', 'foo');
    });
  });

  describe('onDragEnd', () => {
    it('should remove the class from the element and reenable ripples', () => {
      debugElement.triggerEventHandler('dragend', event);
      expect(removeClass).toHaveBeenCalledWith(event.currentTarget, 'dragging');
      expect(ripple.disabled).toBeFalsy();
    });
  });

  describe('onDragOver', () => {
    it('should call the Event\'s preventDefault and stopPropagation functions', () => {
      debugElement.triggerEventHandler('dragover', event);
      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onDragEnter', () => {
    it('should do nothing if ripples are disabled (i.e. the element is dragged back into itself)', () => {
      ripple.disabled = true;
      debugElement.triggerEventHandler('dragenter', event);
      expect(addClass).not.toHaveBeenCalled();
    });

    it(
      `should add a class to the element and launch a ripple if ripples are not disabled
      (i.e. the element is dragged into another element)`, () => {
      ripple.disabled = false;
      debugElement.triggerEventHandler('dragenter', event);
      expect(addClass).toHaveBeenCalledWith(event.currentTarget, 'can-drop');
      // expect(launch).toHaveBeenCalledWith(123, 456, { centered: true, persistent: true, radius: 64 });
    });
  });

  describe('onDragLeave', () => {
    it('should do nothing if the element is dragged out and into a child element', () => {
      event['target'] = {};
      debugElement.triggerEventHandler('dragleave', event);
      expect(removeClass).not.toHaveBeenCalled();
      expect(fadeOutAll).not.toHaveBeenCalled();
    });

    it('should remove the class and fade out all ripples if the element is dragged \'out\' out', () => {
      event['target'] = event['currentTarget'];
      debugElement.triggerEventHandler('dragleave', event);
      expect(removeClass).toHaveBeenCalledWith(event.currentTarget, 'can-drop');
      expect(fadeOutAll).toHaveBeenCalled();
    });
  });

  describe('onDrop', () => {
    it('should emit a DropEvent', () => {
      debugElement.triggerEventHandler('drop', event);
      expect(getData).toHaveBeenCalled();
      expect(dropped).toHaveBeenCalledWith({ event: event, fromId: 'bar', toId: 'foo' });
      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
    });
  });

  describe('fadeOutRipples', () => {
    it('should fade out all ripples', () => {
      ripple.disabled = false;
      debugElement.triggerEventHandler('dragenter', event);
      event['target'] = event['currentTarget'];
      debugElement.triggerEventHandler('dragleave', event);
      expect(removeClass).toHaveBeenCalledWith(event.currentTarget, 'can-drop');
      // expect(fadeOut).toHaveBeenCalled();
      expect(fadeOutAll).toHaveBeenCalled();
    });
  });
});
