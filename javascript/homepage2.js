    const remoteImageRoot = 'https://gettoeasy.com.bd/public/uploads/all/';
    const localImageRoot = 'gettoeasy-assets/gettoeasy-assets/images/';
    const resolveImageSrc = (fileName) => `${remoteImageRoot}${fileName}`;

    const sections = [
      {
        title: 'Feature Phone',
        items: [
          { image: '9xh8YdCwhsD05YbYknBcCA2SLDdmWXS8MYHLjOxj.jpg', name: 'Migo MM50', old: '1,420.00', new: '1,320.00', off: '7%' },
          { image: 'QqN5kKnWvPWqX3PZQdMEFO6fkW3AC67zQeJNd6zN.jpg', name: 'Migo MM30', old: '1,370.00', new: '1,260.00', off: '8%' },
          { image: '6rESfepsiA1BYwiqbgFrWVPTfP7DVrhtTmU0HPC6.jpg', name: 'Migo ML11', old: '1,050.00', new: '930.00', off: '11%' },
          { image: '8pJ69Y9ZXUoihMBHWqiOyHtbVpQuQyrrfsjVlV1D.jpg', name: 'Walton Olvio P18', new: '1,330.00' },
          { image: 'u3cYCEMwvM9EDBSU9NPRsnNEBu7bfztDSxwpLIoI.jpg', name: 'Walton Olvio P15', new: '1,330.00' }
        ]
      },
      {
        title: 'Kid\'s Zone',
        items: [
          { image: 'PiEXiILmqwgqM1saqReu5gzF7hGbueNPRGcuUpEy.webp', name: 'color', old: '450.00', new: '430.00', off: '4%', cod: true },
          { image: 'WoRk0vBqRLlD7pJMZGhYDj1aBpKKvx1DPIHkv9aP.jpg', name: 'Boy Summer Stylish Sleeve less Cotton Fotua', old: '240.00', new: '150.00', off: '38%' },
          { image: '6ZC0t1jwvXQvBXwsOSTV6iE09KhhCPXlK26AVhtX.jpg', name: 'Baby Girls Cotton Fency Frock', old: '240.00', new: '150.00', off: '38%' },
          { image: 'djLQno9hMpEHzHQcKDwJIaBzhss7g28z4HTaC1xj.jpg', name: 'Baby Girl Dress and pants', old: '220.00', new: '150.00', off: '32%' },
          { image: 'mDpdZPSxl8Lh1i3Tn2aabOYsKM5kvPa91cIqPUuM.jpg', name: 'Baby Boys Cotton Fotua', old: '220.00', new: '150.00', off: '32%' }
        ]
      },
      {
        title: 'Refrigerator & Freeze',
        items: [
          { image: 'eDjqf1vYIuqaD60UmOvDMXGQ4QWcBjMNIeKyFTX9.jpg', name: 'Walton Direct Cool Refrigerator 50 Ltr (WFO...)', old: '14,990.00', new: '12,291.80', off: '18%' },
          { image: '3GghPx4sUS9YqiVVk4tfSUcbbI83qFwGK7yMBDFZ.jpg', name: 'Samsung Twin Cooling Refrigerator 465 L', old: '94,900.00', new: '80,665.00', off: '15%' },
          { image: 'XwhMX6rSUvTx9DjqOwViHOb7EPw1YhHSkdLmQtYO.jpg', name: 'Samsung Twin Cooling Refrigerator 345 L', old: '75,900.00', new: '64,515.00', off: '15%' },
          { image: 'AdXwVapkU1RwY66Yfvg1PQBLMzJyzwI0yie3Ect2.jpg', name: 'Samsung Twin Cooling Refrigerator 345 L', old: '71,900.00', new: '61,115.00', off: '15%' },
          { image: 'lUJ06SGD5gN6mkyZuCDvC624HJ7jRwOEfzovkSCl.jpg', name: 'Samsung Twin Cooling Refrigerator 345 L', old: '73,900.00', new: '62,815.00', off: '15%' }
        ]
      }
    ];

    function renderSection(section, sectionIndex) {
      const cards = section.items.map((item) => {
        const badge = item.off ? `<span class="off-badge">OFF<br>${item.off}</span>` : '';
        const cod = item.cod ? '<span class="cod-badge">COD</span>' : '';
        const stock = item.outOfStock ? '<span class="stock-badge">Out of Stock</span>' : '';

        return `
          <article class="card">
            <div class="image-box">
              ${item.off || item.outOfStock || item.cod ? `<div class="badge-wrap">${badge}${cod}${stock}</div>` : ''}
              <img src="${resolveImageSrc(item.image)}" alt="${item.name}" loading="eager" onerror="this.onerror=null;this.src='${localImageRoot}placeholder.jpg';">
            </div>
            <div class="info-box">
              <div class="price-row">
                ${item.old ? `<span class="old-price">৳${item.old}</span>` : ''}
                <span class="new-price">৳${item.new}</span>
              </div>
              <div class="stars">★★★★★</div>
              <div class="name">${item.name}</div>
            </div>
          </article>
        `;
      }).join('');

      return `
        <section class="section-wrap" data-index="${sectionIndex}">
          <div class="section-head">
            <h2>${section.title}</h2>
            <button class="view-btn" type="button">View More</button>
          </div>
          <div class="carousel">
            <button class="arrow left" type="button" aria-label="Previous item">&lsaquo;</button>
            <div class="track">${cards}</div>
            <button class="arrow right" type="button" aria-label="Next item">&rsaquo;</button>
          </div>
        </section>
      `;
    }

    document.getElementById('catalog').innerHTML = sections.map(renderSection).join('');

    document.querySelectorAll('.section-wrap').forEach((sectionEl) => {
      const track = sectionEl.querySelector('.track');
      const prev = sectionEl.querySelector('.left');
      const next = sectionEl.querySelector('.right');
      let index = 0;

      const getVisibleCards = () => {
        if (window.innerWidth <= 520) return 1;
        if (window.innerWidth <= 760) return 2;
        if (window.innerWidth <= 1100) return 3;
        return 5;
      };

      const updateSlider = () => {
        const cards = [...track.children];
        if (!cards.length) return;
        const firstCard = cards[0];
        const gap = 16;
        const step = firstCard.getBoundingClientRect().width + gap;
        const maxIndex = Math.max(0, cards.length - getVisibleCards());
        index = Math.min(maxIndex, Math.max(0, index));
        track.style.transform = `translateX(-${index * step}px)`;
      };

      prev.addEventListener('click', () => {
        index = Math.max(0, index - 1);
        updateSlider();
      });

      next.addEventListener('click', () => {
        const maxIndex = Math.max(0, track.children.length - getVisibleCards());
        index = Math.min(maxIndex, index + 1);
        updateSlider();
      });

      window.addEventListener('resize', updateSlider);
      updateSlider();
    });

    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('img[data-src]').forEach((img) => {
        const placeholder = 'https://gettoeasy.com.bd/public/assets/img/placeholder.jpg';
        const rectPlaceholder = 'https://gettoeasy.com.bd/public/assets/img/placeholder-rect.jpg';
        const current = img.getAttribute('src');
        const next = img.getAttribute('data-src');

        if (!next) return;
        if (!current || current === placeholder || current === rectPlaceholder) {
          img.setAttribute('src', next);
          img.setAttribute('loading', 'eager');
        }
      });
    });
  
