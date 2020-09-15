// textarea actions
const textarea = document.getElementById('response');

// textarea buttons
const toolbar = document.getElementById('toolbar');
toolbar.menuItems = ['#button-bold', '#button-italic', '#button-underline', '.align-left', '.align-center', '.align-right', '#font-color', '#font-size'];

const boldButton = document.getElementById('button-bold');
boldButton.addEventListener('click', () => {
  const isBold = boldButton.getAttribute('aria-pressed') === 'true';
  textarea.style.fontWeight = isBold ? 'normal' : 'bold';
  boldButton.setAttribute('aria-pressed', `${!isBold}`);
});

const italicButton = document.getElementById('button-italic');
italicButton.addEventListener('click', () => {
  const isItalic = italicButton.getAttribute('aria-pressed') === 'true';
  textarea.style.fontStyle = isItalic ? 'normal' : 'italic';
  italicButton.setAttribute('aria-pressed', `${!isItalic}`);
});

const leftButton = document.querySelector('.align-left');
const centerButton = document.querySelector('.align-center');
const rightButton = document.querySelector('.align-right');
leftButton.addEventListener('click', () => {
  const isLeft = leftButton.getAttribute('aria-checked') === 'true';
  if (!isLeft) {
    leftButton.setAttribute('aria-checked', 'true');
    centerButton.setAttribute('aria-checked', 'false');
    rightButton.setAttribute('aria-checked', 'false');
    textarea.style.textAlign = 'left';
  }
});

rightButton.addEventListener('click', () => {
  const isRight = rightButton.getAttribute('aria-checked') === 'true';
  if (!isRight) {
    leftButton.setAttribute('aria-checked', 'false');
    centerButton.setAttribute('aria-checked', 'false');
    rightButton.setAttribute('aria-checked', 'true');
    textarea.style.textAlign = 'right';
  }
});

centerButton.addEventListener('click', () => {
  const isCenter = centerButton.getAttribute('aria-checked') === 'true';
  if (!isCenter) {
    leftButton.setAttribute('aria-checked', 'false');
    centerButton.setAttribute('aria-checked', 'true');
    rightButton.setAttribute('aria-checked', 'false');
    textarea.style.textAlign = 'center';
  }
});

// split buttons
const underLineButton = document.querySelector('.underline-popup');
let underLinePressed = false;
underLineButton.menuItems = ['Solid', 'Dashed', 'Dotted', 'Double', 'Wavy'];
underLineButton.addEventListener('menuAction', (event) => {
  const underLineStyle = event.detail.toLowerCase();
  textarea.style.textDecoration = 'underline';
  textarea.style.textDecorationStyle = underLineStyle;
  underLinePressed = true;
  underLineButton.pressed = true;
});
underLineButton.addEventListener('primaryAction', () => {
  underLinePressed = !underLinePressed;
  textarea.style.textDecoration = underLinePressed ? 'underline' : 'none';
  textarea.style.textDecorationStyle = 'solid';
  underLineButton.pressed = underLinePressed;
});

const colorButton = document.querySelector('.font-color-item');
colorButton.menuItems = ['Black', 'Red', 'Purple', 'Blue', 'Green'];
colorButton.addEventListener('menuAction', (event) => {
  const color = event.detail.toLowerCase();
  textarea.style.color = color;
});
colorButton.addEventListener('primaryAction', () => {
  textarea.style.color = 'black';
});

const fontSizeButton = document.querySelector('.font-size-item');
fontSizeButton.menuItems = ['14px', '16px', '18px', '24px', '32px'];
fontSizeButton.addEventListener('menuAction', (event) => {
  textarea.style.fontSize = event.detail;
});
fontSizeButton.addEventListener('primaryAction', () => {
  textarea.style.fontSize = '16px';
});

// send response
const sendButton = document.getElementById('send-button');
sendButton.menuItems = ['Save Draft', 'Schedule Send'];
sendButton.addEventListener('menuAction', (event) => {
  alert(`${event.detail} action performed. Since this is a sample app, no other changes will show up.`);
});
sendButton.addEventListener('primaryAction', () => {
  alert(`Message sent! Since this is a sample app, no other changes will show up.`);
});

// add new item
const pageWrapper = document.querySelector('.container');
const addDialogButton = document.getElementById('add-button');
const addDialog = document.getElementById('add-modal');
function closeDialog() {
  addDialog.open = false;
  pageWrapper.removeAttribute('inert');
  // setTimeout needed, likely due to inert polyfill
  setTimeout(function() {
    document.getElementById('add-focus-stop').focus();
  }, 0);
}

addDialogButton.addEventListener('primaryAction', function(event) {
  addDialog.open = true;
  addDialog.heading = addDialogButton.innerText;
  pageWrapper.setAttribute('inert', true);
});

addDialogButton.addEventListener('menuAction', function(event) {
  addDialog.open = true;
  addDialog.heading = event.detail;
  pageWrapper.setAttribute('inert', true);
});

addDialog.addEventListener('close', function() {
  closeDialog();
});

// confirm and cancel modal actions
document.getElementById('add-cancel').addEventListener('click', function() {
  closeDialog();
});
document.getElementById('add-confirm').addEventListener('click', function() {
  closeDialog();
});