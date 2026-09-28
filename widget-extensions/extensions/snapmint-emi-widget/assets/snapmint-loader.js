(function () {
  if (window.__SNAPMINT_REACT_LOADING__) return;
  window.__SNAPMINT_REACT_LOADING__ = true;
  var source = document.currentScript && document.currentScript.dataset.bundle;
  if (!source) return;
  var script = document.createElement('script');
  script.src = source;
  script.defer = true;
  document.head.appendChild(script);
})();
