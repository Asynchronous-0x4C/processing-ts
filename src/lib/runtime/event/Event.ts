export class Event{
  static readonly SHIFT = 1 << 0;
  static readonly CTRL  = 1 << 1;
  static readonly META  = 1 << 2;
  static readonly ALT   = 1 << 3;

  // Types of events. As with all constants in Processing, brevity's preferred.
  static readonly KEY = 1;
  static readonly MOUSE = 2;
  static readonly TOUCH = 3;
}