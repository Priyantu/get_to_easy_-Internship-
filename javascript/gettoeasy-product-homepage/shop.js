    const imageRoot = 'images/';

    const sections = window.GETTOEASY_SECTIONS;

    function renderProduct(item, category) {
      const badge = item.off ? `<span class="off-badge">OFF<br>${item.off}</span>` : '';
      const cod = item.cod ? '<span class="cod-badge">COD</span>' : '';
      const stock = item.outOfStock ? '<span class="stock-badge">Out of Stock</span>' : '';

      return `
        <article class="card">
          <div class="image-box">
            ${item.off || item.outOfStock || item.cod ? `<div class="badge-wrap">${badge}${cod}${stock}</div>` : ''}
            <img src="${imageRoot + item.image}" alt="${item.name}" loading="${selectedProductImage ? 'eager' : 'lazy'}" onerror="this.onerror=null;this.src='${imageRoot}placeholder.jpg';">
          </div>
          <div class="info-box">
            <div class="product-category">${category}</div>
            <div class="price-row">
              ${item.old ? `<span class="old-price">৳${item.old}</span>` : ''}
              <span class="new-price">৳${item.new}</span>
            </div>
            <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
            <div class="name">${item.name}</div>
            <div class="product-actions">
              <button type="button" data-action="cart" data-image="${item.image}">Add to Cart</button>
              <button type="button" data-action="wishlist" data-image="${item.image}">♡ Wishlist</button>
              <button type="button" data-action="compare" data-image="${item.image}">Compare</button>
            </div>
          </div>
        </article>
      `;
    }

    const storageKeys = {
      cart: 'gettoeasy-cart',
      wishlist: 'gettoeasy-wishlist',
      compare: 'gettoeasy-compare'
    };

    function readList(key) {
      try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
      } catch (error) {
        console.error(`Could not read local product data (${key}).`, error);
        return [];
      }
    }

    function writeList(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Could not save local product data (${key}).`, error);
        window.alert('Your browser could not save this change. Check local storage settings.');
      }
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[character]);
    }

    function normalizeSearchText(value) {
      return value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    }

    const allProducts = sections.flatMap((section) =>
      section.items.map((item) => ({ item, category: section.title }))
    );
    const searchParams = new URLSearchParams(window.location.search);
    const filter = searchParams.get('filter');
    const view = searchParams.get('view');
    const keyword = (searchParams.get('keyword') || '').trim();
    const selectedProductImage = searchParams.get('product');
    const normalizedKeyword = normalizeSearchText(keyword);
    const isFlashSales = filter === 'sale';
    const isCategoriesView = filter === 'categories';
    const selectedCategory = sections.find(
      (section) => section.title === searchParams.get('category')
    );
    const storedView = view === 'cart' || view === 'wishlist' || view === 'compare'
      ? readList(storageKeys[view])
      : null;
    const matchingProducts = normalizedKeyword
      ? allProducts
        .map((product) => {
          const name = normalizeSearchText(product.item.name);
          const searchable = normalizeSearchText(`${product.item.name} ${product.category}`);
          const terms = normalizedKeyword.split(/\s+/);
          if (!terms.every((term) => searchable.split(' ').some((word) => word.includes(term)))) {
            return null;
          }
          const score = name === normalizedKeyword ? 0 : name.startsWith(normalizedKeyword) ? 1 : name.includes(normalizedKeyword) ? 2 : 3;
          return { ...product, score };
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score)
      : allProducts;
    const products = storedView
      ? storedView.map((entry) => ({
        item: entry,
        category: entry.category || 'Product',
        quantity: Number(entry.quantity) || 1
      }))
      : selectedProductImage
        ? allProducts.filter(({ item }) => item.image === selectedProductImage)
      : isFlashSales
        ? allProducts.filter(({ item }) => item.off && !item.outOfStock)
        : selectedCategory
          ? allProducts.filter(({ category }) => category === selectedCategory.title)
          : normalizedKeyword
            ? matchingProducts
            : allProducts;
    const productCards = products
      .map(({ item, category, quantity }) => {
        const card = renderProduct(item, category);
        if (view === 'cart') {
          return card.replace(
            '<div class="product-actions">',
            `<div class="cart-quantity"><button type="button" data-action="decrease" data-image="${item.image}" aria-label="Decrease quantity">−</button><span>Qty: ${quantity}</span><button type="button" data-action="increase" data-image="${item.image}" aria-label="Increase quantity">+</button></div><div class="product-actions">`
          ).replace(
            '<button type="button" data-action="cart"',
            '<button type="button" data-action="remove"'
          ).replace('>Add to Cart</button>', '>Remove from Cart</button>');
        }
        if (view === 'wishlist' || view === 'compare') {
          return card.replace(
            '<button type="button" data-action="cart"',
            `<button type="button" data-action="remove-${view}"`
          ).replace('>Add to Cart</button>', `>Remove from ${view === 'wishlist' ? 'Wishlist' : 'Compare'}</button>`);
        }
        return card;
      })
      .join('');

    const viewTitle = view === 'cart'
      ? 'Shopping Cart'
      : view === 'wishlist'
        ? 'Wishlist'
        : view === 'compare'
          ? 'Compare Products'
          : isFlashSales
            ? 'Flash Sales'
            : isCategoriesView
              ? 'All Categories'
              : selectedCategory
                ? selectedCategory.title
                : selectedProductImage
                  ? allProducts.find(({ item }) => item.image === selectedProductImage)?.item.name || 'Product'
                : normalizedKeyword
                  ? `Search: ${escapeHtml(searchParams.get('keyword'))}`
                  : 'All Products';

    document.querySelectorAll('.page-nav a').forEach((link) => {
      const label = link.textContent.trim();
      const isActive = view
        ? label.startsWith(view === 'cart' ? 'Cart' : view === 'wishlist' ? 'Wishlist' : 'Compare')
        : isFlashSales
          ? label === 'Flash Sales'
          : isCategoriesView || selectedCategory
            ? label.startsWith('All Categories')
            : label.startsWith('All Products');
      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    document.querySelectorAll('.local-cart-count').forEach((element) => {
      element.textContent = String(readList(storageKeys.cart)
        .reduce((total, item) => total + (Number(item.quantity) || 1), 0));
    });
    document.querySelectorAll('.local-wishlist-count').forEach((element) => {
      element.textContent = String(readList(storageKeys.wishlist).length);
    });
    document.querySelectorAll('.local-compare-count').forEach((element) => {
      element.textContent = String(readList(storageKeys.compare).length);
    });

    const categoryCards = sections.map((section) => {
      const firstProduct = section.items[0];
      return `
        <a class="category-card" href="shop.html?category=${encodeURIComponent(section.title)}">
          <img src="${imageRoot + firstProduct.image}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${imageRoot}placeholder.jpg';">
          <div>
            <h3>${section.title}</h3>
            <span>${section.items.length} products</span>
          </div>
        </a>
      `;
    }).join('');

    const catalogItems = isCategoriesView
      ? `<div class="category-grid">${categoryCards}</div>`
      : `<div class="product-grid">${productCards || '<p class="catalog-message">No products found in this view.</p>'}</div>`;
    document.getElementById('catalog').innerHTML = `
      <div class="catalog-heading">
        <h2>${viewTitle}</h2>
        <span class="catalog-count">${isCategoriesView ? `${sections.length} categories` : `${products.length} products`}</span>
      </div>
      ${catalogItems}
    `;

    document.getElementById('catalog').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const product = allProducts.find(({ item }) => item.image === button.dataset.image);
      const action = button.dataset.action;
      if (!product && !action.startsWith('remove')) return;
      const item = product ? { ...product.item, category: product.category } : null;

      if (action === 'cart') {
        const cart = readList(storageKeys.cart);
        const existing = cart.find((entry) => entry.image === item.image);
        if (existing) existing.quantity = (Number(existing.quantity) || 1) + 1;
        else cart.push({ ...item, quantity: 1 });
        writeList(storageKeys.cart, cart);
      } else if (action === 'wishlist' || action === 'compare') {
        const list = readList(storageKeys[action]);
        if (!list.some((entry) => entry.image === item.image)) list.push(item);
        writeList(storageKeys[action], list);
      } else if (action === 'remove' || action === 'increase' || action === 'decrease') {
        const cart = readList(storageKeys.cart);
        const entry = cart.find((productItem) => productItem.image === button.dataset.image);
        if (entry && action === 'increase') entry.quantity = (Number(entry.quantity) || 1) + 1;
        if (entry && action === 'decrease') entry.quantity = Math.max(1, (Number(entry.quantity) || 1) - 1);
        writeList(storageKeys.cart, action === 'remove'
          ? cart.filter((productItem) => productItem.image !== button.dataset.image)
          : cart);
      } else if (action === 'remove-wishlist' || action === 'remove-compare') {
        const key = action === 'remove-wishlist' ? storageKeys.wishlist : storageKeys.compare;
        writeList(key, readList(key).filter((productItem) => productItem.image !== button.dataset.image));
      }

      window.location.reload();
    });
  
