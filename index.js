let index = 0;
const images = document.querySelectorAll('.carousel img');
setInterval(() => {
    index++;
    if (index === images.length) {
        index = 0;
    }
    const scrollAmount = index * images[0].clientWidth;
    document.querySelector('.carousel').scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}, 10000);