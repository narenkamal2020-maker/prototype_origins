(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const track = document.getElementById('trainerTrack');
  const previous = document.getElementById('trainerPrev');
  const next = document.getElementById('trainerNext');
  const controls = document.querySelector('.trainer-controls');

  function scrollTrainerCards(direction) {
    if (!track) return;
    const card = track.querySelector('.trainer-card');
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 16;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  }

  if (track && previous && next) {
    controls?.removeAttribute('hidden');
    previous.removeAttribute('hidden');
    next.removeAttribute('hidden');
  }
  previous?.addEventListener('click', () => scrollTrainerCards(-1));
  next?.addEventListener('click', () => scrollTrainerCards(1));

  track?.addEventListener('keydown', (event) => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      scrollTrainerCards(event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  document.querySelectorAll('.trainer-portrait-photo img').forEach((image) => {
    const showPortraitFallback = () => {
      const photo = image.closest('.trainer-portrait-photo');
      const name = image.closest('.trainer-card')?.querySelector('h3')?.textContent.trim() || 'Trainer';
      if (!photo || photo.classList.contains('has-fallback')) return;
      const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
      const fallback = document.createElement('div');
      fallback.className = 'trainer-portrait-placeholder';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', `Portrait of ${name} is not included in this project`);
      const monogram = document.createElement('span');
      monogram.className = 'trainer-portrait-initials';
      monogram.setAttribute('aria-hidden', 'true');
      monogram.textContent = initials;
      const note = document.createElement('span');
      note.className = 'trainer-portrait-note';
      note.textContent = 'Portrait to be added';
      fallback.append(monogram, note);
      photo.classList.add('has-fallback');
      image.replaceWith(fallback);
    };
    image.addEventListener('error', showPortraitFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) showPortraitFallback();
  });

  document.querySelectorAll('[data-trainer-card]').forEach((card) => {
    const button = card.querySelector('.trainer-expand');
    const details = card.querySelector('.trainer-details');
    if (!button || !details) return;

    card.classList.add('is-enhanced');
    button.removeAttribute('hidden');
    details.setAttribute('aria-hidden', 'true');
    details.inert = true;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      details.setAttribute('aria-hidden', String(!expanded));
      details.inert = !expanded;
      card.classList.toggle('is-expanded', expanded);
      const label = button.querySelector('span');
      if (label) {
        const collapsedLabel = button.dataset.collapsedLabel
          || (card.classList.contains('trainer-card--placeholder') ? 'View placeholder note' : 'View verified profile');
        label.textContent = expanded
          ? 'Close profile'
          : collapsedLabel;
      }
    });
  });

  const reviewSection = document.getElementById('reviews');
  const reviewTrack = document.getElementById('reviewGallery');
  const reviewViewport = reviewSection?.querySelector('.review-marquee-viewport');
  const mobileReviewQuery = window.matchMedia('(max-width: 760px)');
  const reviewClones = [];
  let mobileReviewFrame = 0;
  let lastMobileReviewFrame = 0;
  const mobileReviewSpeed = 52;

  function removeReviewClones() {
    reviewClones.splice(0).forEach((clone) => clone.remove());
  }

  function normalizeMobileReviewScroll() {
    if (!reviewViewport || !reviewTrack || !mobileReviewQuery.matches || !reviewSection?.classList.contains('reviews-section--moving') || reviewClones.length === 0) return;
    const firstCard = reviewTrack.firstElementChild;
    const firstClone = reviewClones[0];
    if (!firstCard || !firstClone) return;
    const loopWidth = firstClone.offsetLeft - firstCard.offsetLeft;
    if (loopWidth > 0 && reviewViewport.scrollLeft >= loopWidth) {
      reviewViewport.scrollLeft %= loopWidth;
    }
  }

  function stopMobileReviewMotion() {
    if (mobileReviewFrame) window.cancelAnimationFrame(mobileReviewFrame);
    mobileReviewFrame = 0;
    lastMobileReviewFrame = 0;
  }

  function syncMobileReviewMotion() {
    stopMobileReviewMotion();
    if (!reviewViewport || !mobileReviewQuery.matches || reducedMotion.matches || !reviewSection?.classList.contains('reviews-section--moving')) return;

    const animateMobileReviews = (time) => {
      if (!mobileReviewQuery.matches || reducedMotion.matches || !reviewSection.classList.contains('reviews-section--moving')) {
        stopMobileReviewMotion();
        return;
      }
      if (lastMobileReviewFrame) {
        reviewViewport.scrollLeft += ((time - lastMobileReviewFrame) / 1000) * mobileReviewSpeed;
      }
      lastMobileReviewFrame = time;
      normalizeMobileReviewScroll();
      mobileReviewFrame = window.requestAnimationFrame(animateMobileReviews);
    };

    mobileReviewFrame = window.requestAnimationFrame(animateMobileReviews);
  }

  reviewViewport?.addEventListener('scroll', normalizeMobileReviewScroll, { passive: true });
  mobileReviewQuery.addEventListener('change', syncMobileReviewMotion);

  function updateReviewMotion() {
    if (!reviewSection || !reviewTrack) return;

    if (reducedMotion.matches) {
      stopMobileReviewMotion();
      removeReviewClones();
      reviewSection.classList.remove('reviews-section--moving');
      return;
    }

    if (reviewClones.length === 0) {
      Array.from(reviewTrack.children).forEach((card) => {
        if (!card.matches('.review-card')) return;
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('inert', '');
        clone.removeAttribute('data-parallax-card');
        clone.dataset.reviewClone = 'true';
        reviewTrack.appendChild(clone);
        reviewClones.push(clone);
      });
    }

    reviewSection.classList.add('reviews-section--moving');
    syncMobileReviewMotion();
  }

  const motionScroll = window.OriginsMotion && window.OriginsMotion.scroll;
  const motionCleanups = [];

  function clearParallax() {
    motionCleanups.splice(0).forEach((cancel) => cancel());
    document.querySelectorAll('.review-card-inner,.studio-image').forEach((element) => {
      element.style.removeProperty('transform');
    });
  }

  function enableParallax() {
    clearParallax();
    if (!motionScroll || reducedMotion.matches) return;

    document.querySelectorAll('[data-parallax-card]').forEach((card, index) => {
      const inner = card.querySelector('.review-card-inner');
      if (!inner) return;
      const travel = [22, -34, 28][index % 3];
      const cancel = motionScroll((progress) => {
        const y = (0.5 - progress) * travel;
        inner.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      }, { target: card, offset: ['start end', 'end start'] });
      if (typeof cancel === 'function') motionCleanups.push(cancel);
    });

    const story = document.getElementById('studio');
    const studioImage = document.querySelector('.studio-image');
    if (story && studioImage) {
      const cancel = motionScroll((progress) => {
        const y = (progress - 0.5) * 26;
        studioImage.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      }, { target: story, offset: ['start end', 'end start'] });
      if (typeof cancel === 'function') motionCleanups.push(cancel);
    }
  }

  enableParallax();
  updateReviewMotion();
  reducedMotion.addEventListener('change', () => {
    enableParallax();
    updateReviewMotion();
  });
})();
