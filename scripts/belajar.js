document.addEventListener("DOMContentLoaded", function () {
  const learningItemsContainer = document.getElementById("learning-items");
  const searchInput = document.getElementById("search-input");

  let learningData = [];

  // Fungsi untuk memuat data dari JSON
  async function loadLearningData() {
    try {
      const response = await fetch("data.json");
      learningData = await response.json();
      displayLearningItems(learningData);
    } catch (error) {
      console.error("Error loading learning data:", error);
    }
  }

  // Fungsi untuk menampilkan item belajar
  function displayLearningItems(items) {
    learningItemsContainer.innerHTML = "";

    if (items.length === 0) {
      learningItemsContainer.innerHTML =
        '<p class="no-results">Tidak ada data yang ditemukan.</p>';
      return;
    }

    items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "learning-item";

      itemElement.innerHTML = `
                <img src="${item.imagePath}" alt="${item.imageName}">
                <div class="item-content">
                    <h3>${item.aksara}</h3>
                    <p>${item.imageDescription}</p>
                </div>
            `;

          // ✨ Efek membesar saat diklik
      itemElement.addEventListener("click", () => {
        itemElement.classList.toggle("focused");
        document.body.classList.toggle("focus-mode");
      });   

      learningItemsContainer.appendChild(itemElement);
    });
  }

  // Fungsi untuk mencari berdasarkan nama
  function searchItems(query) {
    const filteredItems = learningData.filter((item) =>
      item.imageName.toLowerCase().includes(query.toLowerCase())
    );
    displayLearningItems(filteredItems);
  }

  // Event listener untuk pencarian
  searchInput.addEventListener("input", function () {
    searchItems(this.value);
  });
  

  // Memuat data belajar
  loadLearningData();
});
