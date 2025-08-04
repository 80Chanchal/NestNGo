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
})();

(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      const comment = document.getElementById('comment');
      const trimmed = comment.value.trim();

      event.preventDefault();
      event.stopPropagation();

      // Custom validation for blank or whitespace-only
      if (trimmed === "") {

        comment.classList.add("is-invalid");
        comment.classList.remove("is-valid");
        
        
      } else {
        comment.classList.remove("is-invalid");
        comment.classList.add("is-valid");

        //Only submit when valid
        form.submit();
      }

      
      // Let Bootstrap apply its validation styling
      form.classList.add('was-validated');
    }, false);
  });
})();



