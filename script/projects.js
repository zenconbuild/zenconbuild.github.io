// Filter functionality
const filterTabs = document.querySelectorAll(".filter-tab");
const projectCards = document.querySelectorAll(".project-card");

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.getAttribute("data-filter");

    // Update active tab
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Filter projects
    projectCards.forEach((card) => {
      const cardType = card.getAttribute("data-type");
      const shouldShow = filter === "all" || filter === cardType;

      if (shouldShow) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
});
