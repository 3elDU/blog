const base = new CSSStyleSheet();
base.replaceSync(`
html {
  box-sizing: border-box;
}

*,
::before,
::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
  border: none;
  outline: none;
  color: inherit;
  fill: currentColor;
}`);

export default base;
