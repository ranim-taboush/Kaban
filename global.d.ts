interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
}

interface JQueryStatic {
  (selector: string | Element | Document): JQuery;
  (ready: () => void): JQuery;
}

interface JQuery {
  on(event: string, selector: string, handler: (this: HTMLElement, event: JQuery.Event) => void): this;
  on(event: string, handler: (event: JQuery.Event) => void): this;
  click(handler: (event: JQuery.ClickEvent) => void): this;
  fadeOut(duration: number, complete?: () => void): this;
  fadeIn(duration?: number): this;
  hide(): this;
  show(duration?: number): this;
  remove(): void;
  text(content?: string): this;
  html(content?: string): this;
  val(): string;
  val(value: string): this;
  append(content: string | JQuery | Element): this;
  appendTo(target: string | JQuery | Element): this;
  prepend(content: string | JQuery | Element): this;
  prependTo(target: string | JQuery | Element): this;
  parent(selector?: string): this;
  children(selector?: string): this;
  find(selector: string): this;
  css(property: string, value?: string): this;
  attr(attributeName: string, value?: string): this;
  prop(propertyName: string, value?: any): this;
  addClass(className: string): this;
  removeClass(className: string): this;
  toggleClass(className: string): this;
  hasClass(className: string): boolean;
  each(callback: (index: number, element: Element) => void): this;
  length: number;
  eq(index: number): this;
  first(): this;
  last(): this;
  trigger(eventType: string, extraParameters?: any[]): this;
  delay(duration: number): this;
}

declare var $: JQueryStatic;