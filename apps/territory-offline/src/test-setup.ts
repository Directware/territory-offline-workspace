import 'jest-preset-angular';
import "jest-canvas-mock";

Object.defineProperty(window.URL, "createObjectURL", {
  writable: true,
  value: (param) => {return "";}
});

Object.defineProperty(window, 'crypto', {
  value: () => {}
});

