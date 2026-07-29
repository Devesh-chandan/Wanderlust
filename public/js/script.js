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

  // Wanderlust Preloader Splash Screen (Runs ONLY ONCE on initial website visit, completely skipped on refresh & navigation)
  const preloader = document.getElementById('wanderlustPreloader');
  if (preloader) {
    if (sessionStorage.getItem('hasSeenPreloader')) {
      preloader.style.display = 'none';
      preloader.remove();
    } else {
      sessionStorage.setItem('hasSeenPreloader', 'true');
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 500);
      }, 3000);
    }
  }
})()