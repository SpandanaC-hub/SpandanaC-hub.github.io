"use strict";
const modes = {
  subtype: {
    formula: 'x → q(s<sub>cat</sub> | x) → subtype',
    title: 'Discover target structure without subtype labels.',
    copy: 'Infer category probabilities from the salient encoder. One category is reserved for the reference population; the remaining categories represent target subtypes.'
  },
  paired: {
    formula: 'ỹ = D<sub>common</sub>(z) + D<sub>salient</sub>(s′)',
    title: 'Change the salient state. Preserve the common factors.',
    copy: 'Encode a sample’s common latent z, then decode it with the preset reference category and zero continuous salient code. The result is a model-estimated paired reference counterpart.'
  },
  deviation: {
    formula: 'Δ = x̂ − ỹ ;  DI = mean |Δ|',
    title: 'Measure target-specific variation in feature space.',
    copy: 'Subtract the paired reference from the reconstructed sample to isolate the salient variation. Its mean absolute value across features gives an individual deviation index.'
  }
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const mode = modes[tab.dataset.mode];
  document.getElementById('application-formula').innerHTML = mode.formula;
  document.getElementById('application-title').textContent = mode.title;
  document.getElementById('application-copy').textContent = mode.copy;
  document.getElementById('application-panel').setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectTab(tabs[next], true);
  });
});
document.getElementById('copy-citation').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  const citation = document.getElementById('bibtex');
  try {
    await navigator.clipboard.writeText(citation.textContent);
    status.textContent = 'BibTeX copied to clipboard.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(citation);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
