(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  // Wanderlust Splash Screen (Runs ONLY ONCE on initial website visit, completely skipped on refresh & navigation)
  const preloader = document.getElementById('wanderlustPreloader');
  if (preloader) {
    if (sessionStorage.getItem('hasSeenPreloader')) {
      preloader.style.display = 'none';
      preloader.remove();
    } else {
      sessionStorage.setItem('hasSeenPreloader', 'true');
      const progressFill = document.getElementById('preloaderProgressFill');
      const counterEl = document.getElementById('preloaderCounter');
      
      let progress = 0;
      const duration = 1200; // Crisp & fast 1.2s initial splash
      const intervalTime = 20;
      const increment = 100 / (duration / intervalTime);
      
      const timer = setInterval(() => {
        progress += increment + Math.random();
        if (progress >= 100) {
          progress = 100;
          clearInterval(timer);
          if (progressFill) progressFill.style.width = '100%';
          if (counterEl) counterEl.textContent = '100%';
          
          setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 600);
          }, 150);
        } else {
          const currentVal = Math.floor(progress);
          if (progressFill) progressFill.style.width = currentVal + '%';
          if (counterEl) counterEl.textContent = currentVal + '%';
        }
      }, intervalTime);
    }
  }
})()