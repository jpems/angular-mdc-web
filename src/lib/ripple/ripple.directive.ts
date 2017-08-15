﻿import {
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { EventRegistry } from '../common/event-registry';
import { toBoolean } from '../common/boolean-property';

import { MDCRippleAdapter } from './ripple-adapter';
import { MDCRippleFoundation, util } from '@material/ripple';

@Directive({
  selector: '[mdc-ripple]',
  providers: [EventRegistry]
})
export class Ripple implements OnDestroy {
  private _disabled: boolean;

  unbounded: boolean;
  active: boolean;
  get disabled() { return this._disabled; }
  set disabled(value) {
    this._disabled = toBoolean(value);
    if (this._disabled) {
      this._foundation.destroy();
    } else {
      this._foundation.init();
    }
  }

  private _mdcAdapter: MDCRippleAdapter = {
    browserSupportsCssVars: () => (typeof window !== 'undefined') ? util.supportsCssVariables(window) : false,
    isUnbounded: () => this.unbounded,
    isSurfaceActive: () => this.active,
    isSurfaceDisabled: () => {
      return (this._root.nativeElement.attributes.getNamedItem('disabled') || this.disabled) ? true : false;
    },
    addClass: (className: string) => {
      this._renderer.addClass(this._root.nativeElement, className);
    },
    removeClass: (className: string) => {
      this._renderer.removeClass(this._root.nativeElement, className);
    },
    registerInteractionHandler: (evtType: string, handler: EventListener) => {
      if (this._root) {
        this._registry.listen_(this._renderer, evtType, handler, this._root);
      }
    },
    deregisterInteractionHandler: (evtType: string, handler: EventListener) => {
      this._registry.unlisten_(evtType, handler);
    },
    registerResizeHandler: (handler: EventListener) => {
      if (this._root) {
        this._registry.listen_(this._renderer, 'resize', handler, this._root);
      }
    },
    deregisterResizeHandler: (handler: EventListener) => {
      this._registry.unlisten_('resize', handler);
    },
    updateCssVariable: (varName: string, value: string) => {
      if (this._root) {
        this._root.nativeElement.style.setProperty(varName, value);
      }
    },
    computeBoundingRect: () => {
      const { left, top, height, width } = this._root.nativeElement.getBoundingClientRect();
      return {
        top,
        left,
        right: left,
        bottom: top,
        width: width,
        height: height,
      };
    },
    getWindowPageOffset: () => {
      return {
        x: (typeof window !== 'undefined') ? window.pageXOffset : 0,
        y: (typeof window !== 'undefined') ? window.pageYOffset : 0
      };
    }
  };

  private _foundation: {
    init: Function,
    destroy: Function,
    activate: Function,
    deactivate: Function
  } = new MDCRippleFoundation(this._mdcAdapter);

  constructor(
    private _renderer: Renderer2,
    private _root: ElementRef,
    private _registry: EventRegistry) { }

  ngOnDestroy() {
    this._foundation.destroy();
  }

  init(unbounded?: boolean) {
    this._foundation.init();
    this.unbounded = unbounded;
  }

  activate() {
    this._foundation.activate();
  }

  deactivate() {
    this._foundation.deactivate();
  }
}
