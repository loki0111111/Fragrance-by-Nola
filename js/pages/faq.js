const faqCont = document.querySelectorAll('.faq-cont')

faqCont.forEach(cont => {
  const question  = cont.querySelector('.faq-question')

  question.addEventListener('click', () => {
    cont.classList.toggle('active')
  })
})


const Faqobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('faq-anima');
    }
  });
});

document.querySelectorAll('.faq-cont').forEach(el => Faqobserver.observe(el));