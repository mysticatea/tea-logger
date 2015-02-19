"use strict";

let div = null;

export function html(literalSections, ...substs) {
  let raw = literalSections.raw;
  let html = '';

  // Create HTML text.
  substs.forEach((subst, i) => {
      html += raw[i];
      html += (Array.isArray(subst) ? subst.join('') : subst);
  });
  html += raw[raw.length - 1];
  html = html.trim();

  // Create DOM Instances.
  if (div == null) {
    div = document.createElement("div");
  }
  div.innerHTML = html;

  // Repack into document fragment.
  let df = document.createDocumentFragment();
  let child;
  while ((child = div.firstChild) != null) {
    df.appendChild(child);
  }

  return df;
}

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

export function findAncestor(node, predicate) {
  while (node != null) {
    if (predicate(node)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}
