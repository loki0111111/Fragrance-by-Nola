// navbar logic starts here 
const mobileNav = document.getElementById('mobile-nav');
const openNav = document.getElementById('open-hamburger');
const closeNav = document.getElementById('close-hamburger');


openNav.addEventListener('click', () => {
    mobileNav.classList.add('active');
});

closeNav.addEventListener('click', closeMenu);


function closeMenu() {
    mobileNav.classList.remove('active');
}


function closeNavBar() {
    closeMenu();
}


window.addEventListener('resize', () => {
    if (window.innerWidth > 870) {
        closeMenu();
    }
});
// navbar logic ends here  

// Animation logic starts here 
// home page 
const heroImgobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hero-anima');
    }
  });
});

document.querySelectorAll('.hero-section-img').forEach(el => heroImgobserver.observe(el));


const Signatureobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('signature-collection-anima');
    }
  });
});

document.querySelectorAll('.signature-collection-cont').forEach(el => Signatureobserver.observe(el));


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
    }
  });
});

document.querySelectorAll('.why-choose-cont').forEach(el => observer.observe(el));


const Testobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('testimonial-hidden');
    }
  });
});

document.querySelectorAll('.testimonial-cont').forEach(el => Testobserver.observe(el));


const Faqobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('faq-anima');
    }
  });
});

document.querySelectorAll('.faq-cont').forEach(el => Faqobserver.observe(el));
// home page 


// about page
const Heroobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hero-anima');
    }
  });
});

document.querySelectorAll('.hero-img').forEach(el => Heroobserver.observe(el));


const Aboutobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('abc-content-anima');
    }
  });
});

document.querySelectorAll('.about-content-cont').forEach(el => Aboutobserver.observe(el));




const AboutImaobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('about-img-anima');
    }
  });
});

document.querySelectorAll('.about-img').forEach(el => AboutImaobserver.observe(el));
// about page
// Animation logic ends here 


// tetsimonial logic starts here 
const loadMoreBtn = document.getElementById('loadTestimonial')
const lessMoreBtn = document.getElementById('lessTestimonial')
const hiddenTestimonials = document.querySelectorAll('.testimonial-cont.hide')

loadMoreBtn.addEventListener('click', () => {
  hiddenTestimonials.forEach(card => {
    card.style.display = 'flex'
  })

  loadMoreBtn.style.display = 'none'
  lessMoreBtn.style.display = 'block'
})


lessMoreBtn.addEventListener('click', () => {
  hiddenTestimonials.forEach(card => {
    card.style.display = 'none'
  })

  lessMoreBtn.style.display = 'none'
  loadMoreBtn.style.display = 'block'
})
// testimonial logic ends here 



// faq logic starts here 
const faqCont = document.querySelectorAll('.faq-cont')

faqCont.forEach(cont => {
  const question  = cont.querySelector('.faq-question')

  question.addEventListener('click', () => {
    cont.classList.toggle('active')
  })
})
// faq logic ends here 


// footer year logic starts here 
const year = document.getElementById('year')

const date =  new Date().getFullYear()
year.innerHTML = date
// footer year logic ends here 

// HERO ADD TO CART 
const heroCartBtn = document.getElementById('hero-cart-btn');
if (heroCartBtn) {
  heroCartBtn.addEventListener('click', () => {
    const item = {
      name: '24k',
      price: 7500,
      size: '100ml',
      image: 'assets/images/perfume-images/24k-7500-100ml-perfume.jpg',
      quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // update cart count
    const total = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartCountEl = document.querySelector('.cart-id');
    if (cartCountEl) cartCountEl.textContent = total;

    alert('24k added to cart!');
  });
}


// SIGNATURE ADD TO CART 
document.querySelectorAll('.signature-collection-cont').forEach(card => {
  const btn = card.querySelector('.add-to-cart-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const item = {
        name: card.dataset.name,
        price: parseInt(card.dataset.price),
        size: card.dataset.size,
        image: card.dataset.image,
        quantity: 1
      };

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(i => i.name === item.name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      const total = cart.reduce((sum, i) => sum + i.quantity, 0);
      const cartCountEl = document.querySelector('.cart-id');
      if (cartCountEl) cartCountEl.textContent = total;

      alert(`${item.name} added to cart!`);
    });
  }
});