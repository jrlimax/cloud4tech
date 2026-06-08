(function () {
    var t = localStorage.getItem('c4t-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
})();
