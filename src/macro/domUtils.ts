/**
 * Resolves unique CSS selector even across Shadow DOM retargeting using composedPath.
 */
export function getUniqueSelectorFromPath(path: EventTarget[]): string {
  const elements: HTMLElement[] = [];

  for (const target of path) {
    if (target instanceof HTMLElement) {
      if (target.closest("#my-custom-bookmarklet")) return "";
      elements.push(target);
    }
  }

  if (elements.length === 0) return "";

  const targetEl = elements[0];

  if (targetEl.id) {
    return `#${targetEl.id}`;
  }

  if (targetEl.getAttribute("name")) {
    return `${targetEl.tagName.toLowerCase()}[name="${targetEl.getAttribute("name")}"]`;
  }

  const parts: string[] = [];
  let curr: HTMLElement | null = targetEl;

  while (curr && curr !== document.body && curr.nodeType === Node.ELEMENT_NODE) {
    let selector = curr.tagName.toLowerCase();
    if (curr.id) {
      parts.unshift(`#${curr.id}`);
      break;
    } else {
      let sibling = curr;
      let nth = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling as HTMLElement;
        if (sibling.tagName === curr.tagName) nth++;
      }
      if (nth > 1) selector += `:nth-of-type(${nth})`;
    }
    parts.unshift(selector);
    curr = curr.parentElement;
  }

  return parts.join(" > ");
}

/**
 * Searches across document root and open Shadow DOM hosts to locate target elements.
 */
export function queryCrossBoundaries(selector: string): HTMLElement | null {
  if (!selector) return null;

  const docResult = document.querySelector<HTMLElement>(selector);
  if (docResult) return docResult;

  const hosts = Array.from(document.querySelectorAll("*")).filter(
    (el) => el.shadowRoot
  );

  for (const host of hosts) {
    if (host.shadowRoot) {
      const found = host.shadowRoot.querySelector<HTMLElement>(selector);
      if (found) return found;
    }
  }

  return null;
}