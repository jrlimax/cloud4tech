(function () {
    var t = localStorage.getItem('c4t-theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
})();
