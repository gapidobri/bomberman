import { Controls } from './lib/player';

const player1Fields =
  document.querySelectorAll<HTMLInputElement>('#player1 input');
const player2Fields =
  document.querySelectorAll<HTMLInputElement>('#player2 input');

const p1SaveBtn = document.getElementById('p1save');
const p2SaveBtn = document.getElementById('p2save');

const p1Controls: Controls = loadFromStorage('p1controls') ?? {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  place: ' ',
};

player1Fields.forEach((field) => {
  field.value = p1Controls[field.name as keyof Controls];
});

const p2Controls: Controls = loadFromStorage('p2controls') ?? {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
  place: 'q',
};

player2Fields.forEach((field) => {
  field.value = p2Controls[field.name as keyof Controls];
});

p1SaveBtn?.addEventListener('click', () => {
  player1Fields.forEach((field) => {
    p1Controls[field.name as keyof Controls] = field.value;
  });

  saveToStorage('p1controls', p1Controls);
});

p2SaveBtn?.addEventListener('click', () => {
  player2Fields.forEach((field) => {
    p2Controls[field.name as keyof Controls] = field.value;
  });

  saveToStorage('p2controls', p2Controls);
});

function saveToStorage(key: string, value: Controls) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key: string): Controls | null {
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
}
