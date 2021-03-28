import { Directive, EventEmitter, HostBinding, HostListener, Output, Renderer2 } from '@angular/core';
import { MatRipple, RippleRef } from '@angular/material';

import { DropEvent } from './drop.event';

@Directive({
  selector: '[appDraggable]',
  providers: [MatRipple]
})
export class DraggableDirective {
  private rippleRef: RippleRef;

  @HostBinding('class')
  public class = 'draggable';

  /**
   * Bind the native HTML5 'draggable' attribute to the element
   */
  @HostBinding('draggable')
  public draggable = true;

  @Output() dropped: EventEmitter<DropEvent> = new EventEmitter<DropEvent>();

  constructor(
    private renderer: Renderer2,
    private ripple: MatRipple
  ) {}

  /**
   * Called when a 'start' DragEvent is triggered on the target
   * i.e. The user starts to drag a draggable element
   * The EventTarget is the element being dragged
   * @param event The 'start' DragEvent
   */
  @HostListener('dragstart', ['$event'])
  public onDragStart(event: DragEvent): void {
    this.renderer.addClass(event.currentTarget, 'dragging');
    // Disable the ripple effect on the element being dragged
    this.ripple.disabled = true;

    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('id', (<HTMLElement>event.currentTarget).dataset['id']);
  }

  /**
   * Called when an 'end' DragEvent is triggered on the target (a 'start' DragEvent must have been triggered first)
   * i.e. The user stops dragging a draggable element
   * The EventTarget is the element being dragged
   * @param event The 'end' DragEvent
   */
  @HostListener('dragend', ['$event'])
  public onDragEnd(event: DragEvent): void {
    this.renderer.removeClass(event.currentTarget, 'dragging');
    // Re-enable the ripple effect
    this.ripple.disabled = false;
  }

  /**
   * Called when an 'over' DragEvent is triggered on the target
   * i.e. The user drags one draggable element over another
   * The EventTarget is the element being dragged over (not the element being dragged)
   * @param event An 'over' DragEvent
   */
  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent): boolean | void {
    /**
     * Prevent the default behaviour
     * i.e. Allow one draggable element to be 'dropped' on another
     */
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  /**
   * Called when an 'enter' DragEvent is triggered on a target
   * i.e. The user drags one draggable element into another
   * The EventTarget is the element being dragged into (not the element being dragged)
   * @param event An 'enter' DragEvent
   */
  @HostListener('dragenter', ['$event'])
  public onDragEnter(event: DragEvent): void {
    // If this is the element being dragged, do nothing
    if (!this.ripple.disabled) {
      // Ignore dragenter / drag leave events on child elements
      // if (event.target === event.currentTarget) {
        this.renderer.addClass(event.currentTarget, 'can-drop');

        // @todo: launch ripple centered on the currentTarget\'s .label
        // Launch a ripple
        // this.rippleRef = this.ripple.launch(event.clientX, event.clientY, {
        //   centered: true,
        //   persistent: true,
        //   radius: 64
        // });
      // }
    }
  }

  /**
   * Called when a 'leave' DragEvent is triggered on a target (an 'enter' DragEvent must have been triggered first)
   * i.e. The user drags one draggable element out of another
   * The EventTarget is the element being dragged out of (not the element being dragged)
   * @param event A 'leave' DragEvent
   */
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent): void {
    // Ignore dragenter / drag leave events on child elements
    if (event.target === event.currentTarget) {
      this.fadeOutRipples(event.currentTarget);
    }
  }

  /**
   * Called when a 'drop' DragEvent is triggered on a target
   * i.e. The user drops one draggable element on to another
   * The EventTarget is the element being dropped on to (not the element being dropped)
   * @param event The 'drop' DragEvents
   */
  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent): boolean | void {
    const fromId: string = event.dataTransfer.getData('id');
    const toId: string = (<HTMLElement>event.currentTarget).dataset['id'];

    this.dropped.emit({ event: event, fromId: fromId, toId: toId });

    this.fadeOutRipples(event.currentTarget);

    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  private fadeOutRipples(eventTarget: EventTarget): void {
    this.renderer.removeClass(eventTarget, 'can-drop');
    // Fade out any ripples
    if (this.rippleRef) { this.rippleRef.fadeOut(); }
    this.ripple.fadeOutAll();
  }
}
