const STORAGE_KEY = "wishlist";
const wishlistContainer = document.getElementById("wishlistContainer");
const emptyState = document.getElementById("emptyState");
const sortSelect = document.getElementById("sortSelect");
const categorySelect = document.getElementById("categorySelect");
const detailModal = document.getElementById("detailModal");

let wishlist = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function renderWishlist() {
  const cat = categorySelect.value;
  let filtered = wishlist.filter(
    (item) => cat === "all" || item.category === cat
  );

  const sort = sortSelect.value;
  filtered.sort((a, b) => {
    const getPrice = (i) => parseFloat(i.price.replace(/[^\d.]/g, ""));
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "price-asc") return getPrice(a) - getPrice(b);
    if (sort === "price-desc") return getPrice(b) - getPrice(a);
    return 0;
  });

  wishlistContainer.innerHTML = "";
  if (filtered.length === 0) {
    emptyState.style.display = "block";
    wishlistContainer.style.display = "none";
  } else {
    emptyState.style.display = "none";
    wishlistContainer.style.display = "grid";
    filtered.forEach((item, index) => {
      wishlistContainer.innerHTML += `
        <div class="wishlist-card">
          <div class="wishlist-image-wrapper">
            <img src="${item.img || "images/placeholder.png"}" alt="${
        item.name
      }" class="wishlist-image" />
            <span class="wishlist-category">${item.category}</span>
          </div>
          <div class="wishlist-content">
            <h3 class="wishlist-name">${item.name}</h3>
            <p class="wishlist-desc">${item.desc}</p>
            <p class="wishlist-price">${item.price}</p>
            <div class="wishlist-actions">
              <button class="btn btn-view-detail view-detail" data-index="${index}">
                <i data-lucide="eye"></i>
                View Detail
              </button>
              <button class="btn btn-remove remove-btn" data-index="${index}">
                <i data-lucide="trash-2"></i>
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });

    // Re-initialize Lucide icons
    lucide.createIcons();

    // Add event listeners
    document.querySelectorAll(".view-detail").forEach((btn) => {
      btn.addEventListener("click", () => viewDetail(btn.dataset.index));
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => removeItem(btn.dataset.index));
    });
  }

  // Re-initialize Lucide icons for empty state
  lucide.createIcons();
}

function removeItem(index) {
  const removed = wishlist.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  showToast(`${removed[0].name} removed from wishlist`, "success");
  renderWishlist();
}

function viewDetail(index) {
  const item = wishlist[index];
  document.getElementById("modalImg").src =
    item.img || "images/placeholder.png";
  document.getElementById("modalName").textContent = item.name;
  document.getElementById("modalDesc").textContent = item.desc;
  document.getElementById("modalPrice").textContent = item.price;
  document.getElementById("modalCategory").textContent = item.category;
  detailModal.style.display = "flex";
  lucide.createIcons();
}

document.querySelector(".modal-close").onclick = () => {
  detailModal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === detailModal) detailModal.style.display = "none";
};

sortSelect.onchange = renderWishlist;
categorySelect.onchange = renderWishlist;

renderWishlist();
