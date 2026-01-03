const products = [
  {
    name: "Modern Sofa Set",
    category: "Furniture",
    price: "₹35,000",
    desc: "Handpicked premium finish sofa that blends perfectly with brown & cream interiors.",
    img: "./images/modern-sofa-set.png",
  },
  {
    name: "Teak Dining Table",
    category: "Furniture",
    price: "₹45,000",
    desc: "6-seater teak table with high gloss finish and elegant design.",
    img: "./images/teak-dining-table.png",
  },
  {
    name: "Wall Art Decor",
    category: "Decor",
    price: "₹5,000",
    desc: "Abstract canvas art with subtle earthy tones for modern homes.",
    img: "./images/wall-art-decor.png",
  },
  {
    name: "Pendant Lights",
    category: "Lighting",
    price: "₹8,000",
    desc: "Beautiful pendant lights adding cozy golden ambiance.",
    img: "./images/pendant-lights.png",
  },
  {
    name: "Classic Armchair",
    category: "Furniture",
    price: "₹22,000",
    desc: "Velvet texture armchair with carved wooden legs.",
    img: "./images/classic-armchair.png",
  },
  {
    name: "Floor Rug",
    category: "Decor",
    price: "₹7,000",
    desc: "Soft woven rug in neutral cream shades.",
    img: "./images/floor-rug.png",
  },
  {
    name: "Wooden Bookshelf",
    category: "Furniture",
    price: "₹18,000",
    desc: "Tall organizer with smooth teak finish.",
    img: "./images/wooden-bookshelf.png",
  },
  {
    name: "Decor Vase Set",
    category: "Decor",
    price: "₹3,500",
    desc: "Handcrafted vases for elegant table setup.",
    img: "./images/decor-vase-set.png",
  },
  {
    name: "King Size Bed",
    category: "Furniture",
    price: "₹55,000",
    desc: "Solid wood frame with modern comfort design.",
    img: "./images/king-size-bed.png",
  },
  {
    name: "Curtain Set",
    category: "Decor",
    price: "₹4,200",
    desc: "Brown and beige shades with soft texture.",
    img: "./images/curtain-set.png",
  },
  {
    name: "Wall Mirror",
    category: "Decor",
    price: "₹6,000",
    desc: "Rounded mirror with bronze border frame.",
    img: "./images/wall-mirror.png",
  },
  {
    name: "Indoor Plant Pot",
    category: "Decor",
    price: "₹2,500",
    desc: "Ceramic pot ideal for indoor décor corners.",
    img: "./images/indoor-plant-pot.png",
  },
];

const productGrid = document.getElementById("products");
const wishlistCountEl = document.getElementById("wishlist-count");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const modalCategory = document.getElementById("modalCategory");
const closeModal = document.getElementById("closeModal");
const backTop = document.getElementById("backTop");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");

// Load wishlist count
function loadWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlistCountEl.textContent = wishlist.length;
}

loadWishlistCount();

// Add to wishlist
function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (!wishlist.some((p) => p.name === product.name)) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    wishlistCountEl.textContent = wishlist.length;
    showToast(`${product.name} added to wishlist! 💖`, "success");
  } else {
    showToast("Already in wishlist!", "info");
  }
}

// Render products
function renderProducts(filteredProducts) {
  productGrid.innerHTML = filteredProducts
    .map(
      (p, i) => `
          <div class="product-card">
            <img src="${p.img}" alt="${p.name}" class="product-image" />
            <div class="product-content">
              <span class="product-category">${p.category}</span>
              <h3 class="product-name">${p.name}</h3>
              <p class="product-desc">${p.desc}</p>
              <p class="product-price">${p.price}</p>
              <div class="product-actions">
                <button class="btn btn-quick-view quick-view" data-index="${i}">
                  <i data-lucide="eye"></i>
                  Quick View
                </button>
                <button class="btn btn-wishlist wishlist-btn" data-index="${i}">
                  <i data-lucide="heart"></i>
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        `
    )
    .join("");

  // Re-initialize Lucide icons
  lucide.createIcons();

  // Add event listeners
  document.querySelectorAll(".quick-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = filteredProducts[btn.dataset.index];
      modalImg.src = p.img;
      modalName.textContent = p.name;
      modalDesc.textContent = p.desc;
      modalPrice.textContent = p.price;
      modalCategory.textContent = p.category;
      modal.style.display = "flex";
    });
  });

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = filteredProducts[btn.dataset.index];
      addToWishlist(product);
    });
  });
}

renderProducts(products);

// Close modal
closeModal.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Filter products
function filterProducts() {
  const category = categoryFilter.value;
  const search = searchInput.value.toLowerCase();
  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search) ||
        p.desc.toLowerCase().includes(search))
  );
  renderProducts(filtered);
}

categoryFilter.addEventListener("change", filterProducts);
searchInput.addEventListener("input", filterProducts);
