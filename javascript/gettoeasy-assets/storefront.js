(() => {
  const localRoot = '../gettoeasy-product-homepage/';
  const storageKeys = {
    cart: 'gettoeasy-cart',
    wishlist: 'gettoeasy-wishlist',
    compare: 'gettoeasy-compare'
  };
  const productImageRoot = '../gettoeasy-product-homepage/images/';

  const readList = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.error(`Could not read local storefront data (${key}).`, error);
      return [];
    }
  };

  const updateCounts = () => {
    const cart = readList(storageKeys.cart);
    const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
    document.querySelectorAll('.cart-count').forEach((element) => {
      element.textContent = String(cartCount);
    });
    document.querySelectorAll('.local-wishlist-count').forEach((element) => {
      element.textContent = String(readList(storageKeys.wishlist).length);
    });
    document.querySelectorAll('.local-compare-count').forEach((element) => {
      element.textContent = String(readList(storageKeys.compare).length);
    });
  };

  const localUrlFor = (url) => {
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const params = url.searchParams;

    if (path === '/help-center' || path === '/support-policy' || path === '/privacy-policy' ||
        path === '/return-policy' || path === '/terms' || path === '/delivery-policy' ||
        path === '/all-notifications') {
      return `${localRoot}help.html${path === '/support-policy' ? '#policies' : ''}`;
    }
    if (path.startsWith('/users/')) return `${localRoot}account.html`;
    if (path === '/search') {
      const query = new URLSearchParams();
      const keyword = params.get('keyword') || '';
      if (keyword) query.set('keyword', keyword);
      return `${localRoot}shop.html${keyword ? `?${query}` : ''}`;
    }
    if (path === '/compare') return `${localRoot}shop.html?view=compare`;
    if (path === '/wishlists') return `${localRoot}shop.html?view=wishlist`;
    if (path === '/cart') return `${localRoot}shop.html?view=cart`;
    if (path === '/flash-deals') return `${localRoot}shop.html?filter=sale`;
    if (path === '/categories' || path.startsWith('/category/')) {
      return `${localRoot}shop.html?filter=categories`;
    }
    if (path === '/brands') return `${localRoot}shop.html`;
    if (path === '/blog') return `${localRoot}blog.html`;
    if (path.startsWith('/product/')) {
      const keyword = decodeURIComponent(path.slice('/product/'.length).replace(/-/g, ' '));
      return `${localRoot}shop.html?keyword=${encodeURIComponent(keyword)}`;
    }
    if (path === '/') return '../gettoeasy-assets/homepage.html';
    return `${localRoot}shop.html`;
  };

  const rewriteLinks = (root = document) => {
    root.querySelectorAll('a[href^="http"]').forEach((link) => {
      try {
        const url = new URL(link.href);
        if (url.hostname === 'gettoeasy.com.bd' || url.hostname === 'www.gettoeasy.com.bd') {
          link.href = localUrlFor(url);
          link.removeAttribute('target');
        }
      } catch (error) {
        console.error('Could not map an external storefront link locally.', error);
      }
    });
  };

  const normalizeSearchText = (value) => value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  document.addEventListener('DOMContentLoaded', () => {
    rewriteLinks();
    updateCounts();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) rewriteLinks(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const searchInput = document.querySelector('#search[name="keyword"]');
    const searchForm = searchInput?.closest('form');
    if (searchForm) {
      const localInput = searchInput.cloneNode(true);
      localInput.setAttribute('autocomplete', 'off');
      searchInput.replaceWith(localInput);

      const suggestionBox = document.querySelector('.typed-search-box');
      const suggestions = document.querySelector('#search-content');
      const products = (window.GETTOEASY_SECTIONS || []).flatMap((section) =>
        section.items.map((item) => ({ ...item, category: section.title }))
      );

      if (suggestionBox && suggestions) {
        suggestionBox.querySelector('.search-preloader')?.remove();
        suggestionBox.querySelector('.search-nothing')?.remove();
        suggestionBox.style.minHeight = '0';

        const style = document.createElement('style');
        style.textContent = `
          .local-search-result { display:flex; align-items:center; gap:12px; padding:10px 14px; color:#222; text-decoration:none; }
          .local-search-result:hover, .local-search-result:focus { background:#f2f8f7; color:#087966; text-decoration:none; }
          .local-search-result img { width:48px; height:48px; object-fit:contain; border-radius:5px; background:#fff; }
          .local-search-result-name { display:block; font-weight:600; }
          .local-search-result-meta { display:block; color:#737b7e; font-size:12px; }
          .local-search-empty { padding:12px 14px; color:#737b7e; }
        `;
        document.head.appendChild(style);

        const renderSuggestions = () => {
          const query = normalizeSearchText(localInput.value);
          suggestions.replaceChildren();
          if (!query) {
            suggestionBox.classList.add('d-none');
            document.body.classList.remove('typed-search-box-shown');
            return;
          }

          const terms = query.split(/\s+/).filter(Boolean);
          const matches = products
            .map((item) => {
              const name = normalizeSearchText(item.name);
              const searchable = normalizeSearchText(`${item.name} ${item.category}`);
              if (!terms.every((term) => searchable.includes(term))) return null;
              const score = name === query ? 0 : name.startsWith(query) ? 1 : name.includes(query) ? 2 : 3;
              return { item, score };
            })
            .filter(Boolean)
            .sort((a, b) => a.score - b.score)
            .slice(0, 6);

          if (!matches.length) {
            suggestions.innerHTML = `<div class="local-search-empty" role="status">No matching local products found.</div>`;
          } else {
            suggestions.innerHTML = matches.map(({ item }) => `
              <a class="local-search-result" href="${localRoot}shop.html?product=${encodeURIComponent(item.image)}">
                <img src="${productImageRoot}${encodeURIComponent(item.image)}" alt="" loading="eager">
                <span>
                  <span class="local-search-result-name">${escapeHtml(item.name)}</span>
                  <span class="local-search-result-meta">${escapeHtml(item.category)} · ৳${escapeHtml(item.new)}</span>
                </span>
              </a>
            `).join('');
          }

          suggestionBox.classList.remove('d-none');
          document.body.classList.add('typed-search-box-shown');
        };

        localInput.addEventListener('input', renderSuggestions);
        localInput.addEventListener('focus', renderSuggestions);
        localInput.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            suggestionBox.classList.add('d-none');
            document.body.classList.remove('typed-search-box-shown');
          }
        });
        document.addEventListener('click', (event) => {
          if (!searchForm.contains(event.target) && !suggestionBox.contains(event.target)) {
            suggestionBox.classList.add('d-none');
            document.body.classList.remove('typed-search-box-shown');
          }
        });
      }

      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const keyword = localInput.value.trim();
        if (!keyword) {
          localInput.focus();
          return;
        }
        window.location.href = `${localRoot}shop.html?keyword=${encodeURIComponent(keyword)}`;
      }, true);
    }

    const newsletterForm = document.querySelector('form[action*="/subscribers"]');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let message = newsletterForm.querySelector('[data-local-newsletter-message]');
        if (!message) {
          message = document.createElement('p');
          message.dataset.localNewsletterMessage = 'true';
          message.setAttribute('role', 'status');
          newsletterForm.appendChild(message);
        }
        message.textContent = 'Newsletter subscription is a demo and is not connected to a server.';
      });
    }
  });
})();
