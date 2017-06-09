import { Directive, EventEmitter, Input, Inject, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[focus]' // Attribute selector
})
export class FocusDirective {

  @Input("focus") focusEvent: EventEmitter<boolean>;

  constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer) {
  }

  ngOnInit() {
    this.focusEvent.subscribe(event => {
      this.renderer.invokeElementMethod(this.element.nativeElement, "focus", []);
    })
  }

}
