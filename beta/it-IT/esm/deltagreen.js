function e() {
  function e() {
    let e = document.getElementsByClassName(`grid grid-3col`);
    for (let t of e) {
      let e = t.childNodes,
        n = [];
      for (let t of e) t.innerText && t.tagName === `DIV` && n.push(t);
      n.sort((e, t) => e.innerText.localeCompare(t.innerText));
      for (let e of n) t.appendChild(e);
    }
  }
  Hooks.on(`renderActorSheet`, () => {
    e();
  });
}
export { e as init };
