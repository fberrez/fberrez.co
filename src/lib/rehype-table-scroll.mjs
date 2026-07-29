/* Wraps every markdown table in a scrollable div.

   A table has a minimum width below which its columns stop making sense, and on
   a phone that is wider than the screen. Without a wrapper the only element that
   can scroll is the page itself, which means the whole article slides sideways.
   The wrapper keeps the overflow local to the table.

   Written by hand rather than with unist-util-visit to avoid a dependency for
   one tree walk. */

export function rehypeTableScroll() {
  return (tree) => {
    walk(tree);
  };
}

function walk(node) {
  if (!node.children) return;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'element' && child.tagName === 'table') {
      node.children[i] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], tabindex: 0, role: 'region' },
        children: [child],
      };
      continue; // Nothing inside a table needs wrapping.
    }
    walk(child);
  }
}
