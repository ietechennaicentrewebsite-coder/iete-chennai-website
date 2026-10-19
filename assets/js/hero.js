/* Home page slideshow - works with any number of <img class="slide"> inside .hero-slides */
(function () {
  var box = document.querySelector('.hero-slides');
  if (!box) return;
  var slides = box.querySelectorAll('.slide');
  var dotsBox = document.querySelector('.hero-dots');
  var DELAY = 7000, cur = 0, timer;
  Array.prototype.forEach.call(slides, function (s) {
    if (s.getAttribute('data-pos')) s.style.objectPosition = s.getAttribute('data-pos');
  });
  if (slides.length < 2) return;
  var dots = [];
  if (dotsBox) {
    dotsBox.removeAttribute('aria-hidden');
    Array.prototype.forEach.call(slides, function (_, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Show photo ' + (i + 1));
      b.addEventListener('click', function () { show(i); restart(); });
      dotsBox.appendChild(b); dots.push(b);
    });
  }
  function show(n) {
    slides[cur].classList.remove('is-active');
    cur = (n + slides.length) % slides.length;
    slides[cur].removeAttribute('loading');
    slides[cur].classList.add('is-active');
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === cur); });
  }
  function restart() { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, DELAY); }
  dots.length && dots[0].classList.add('is-on');
  restart();
})();
