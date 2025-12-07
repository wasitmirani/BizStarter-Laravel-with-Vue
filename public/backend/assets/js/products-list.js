(function () {
    "use strict"

    // Sample Data
    const productsData = [
        ['SPK001', 'Leather Ladies Bag', '/backend/assets/images/ecommerce/png/14.png', '$699.99', 'In Stock', 'Published', '120', 'Mar 12, 2025', 'electronics'],
        ['SPK002', 'Wireless Headset', '/backend/assets/images/ecommerce/png/16.png', '$89.99', 'Out of Stock', 'Draft', '0', 'Mar 10, 2025', 'fashion'],
        ['SPK003', 'Adidas Men shoe', '/backend/assets/images/ecommerce/png/15.png', '$399.99', 'In Stock', 'Published', '45', 'Mar 5, 2025', 'home'],
        ['SPK004', 'Money Plant', '/backend/assets/images/ecommerce/png/17.png', '$129.99', 'In Stock', 'Published', '250', 'Mar 2, 2025', 'electronics'],
        ['SPK005', 'Pink Ladies Bag', '/backend/assets/images/ecommerce/png/19.png', '$199.99', 'In Stock', 'Archived', '75', 'Feb 28, 2025', 'fashion'],
        ['SPK006', 'Samsung Headset', '/backend/assets/images/ecommerce/png/11.png', '$149.99', 'Out of Stock', 'Draft', '0', 'Feb 25, 2025', 'home'],
        ['SPK007', 'Wool Ladies Bag', '/backend/assets/images/ecommerce/png/12.png', '$79.99', 'In Stock', 'Published', '300', 'Feb 20, 2025', 'electronics'],
        ['SPK008', 'Alaram Clock', '/backend/assets/images/ecommerce/png/18.png', '$59.99', 'In Stock', 'Published', '150', 'Feb 18, 2025', 'fashion'],
    ];

    const grid = new gridjs.Grid({
        columns: [
            {
                name: '#',
                formatter: (_, row) => gridjs.html(
                    `<input class="form-check-input" type="checkbox" id="product-${row.cells[0].data}" value="" aria-label="...">`
                )
            },
            {
                name: 'Product ID',
                formatter: (_, row) => gridjs.html(
                    `<a href="javascript:void(0);">${row.cells[0].data}</a>`  // Correctly map to Product ID (row[0])
                )
            },
            {
                name: 'Product Name',
                formatter: (_, row) => gridjs.html(
                    `<div class="d-flex align-items-center gap-3 position-relative">
                        <a href="product-details.php" class="stretched-link"></a>
                        <div class="lh-1">
                            <span class="avatar avatar-md avatar-square bg-light">
                                <img src="${row.cells[2].data}" alt="Product Image">
                            </span>
                        </div>
                        <div>
                            <span class="d-block fw-semibold">${row.cells[1].data}</span>
                            <span class="text-muted fs-13">${row.cells[8].data}</span>
                        </div>
                    </div>`
                )
            },
            'Price',
            {
                name: 'Stock Status',
                formatter: (_, row) => gridjs.html(
                    `<span class="badge bg-${row.cells[4].data === 'In Stock' ? 'secondary' : 'danger'}-transparent">${row.cells[4].data}</span>`
                )
            },
            {
                name: 'Quantity',
                formatter: (_, row) => gridjs.html(
                    `${row.cells[6].data}` // Correctly map to Quantity (row[6])
                )
            },
            {
                name: 'Status',
                formatter: (_, row) => gridjs.html(
                    `<span class="text-${row.cells[5].data === 'Published' ? 'primary' : row.cells[5].data === 'Archived' ? 'secondary' : 'danger'}">${row.cells[5].data}</span>`
                )
            },
            'Date Added',
            {
                name: 'Actions',
                formatter: (_, row) => gridjs.html(`
                    <div class="dropdown">
                        <a href="javascript:void(0);" class="btn btn-icon btn-sm btn-primary-light" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="javascript:void(0);"><i class="ri-eye-line me-2"></i>View</a></li>
                            <li><a class="dropdown-item" href="javascript:void(0);"><i class="ri-pencil-line me-2"></i>Edit</a></li>
                            <li><a class="dropdown-item" href="javascript:void(0);"><i class="ri-delete-bin-line me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                `)
            }
        ],
        data: productsData,
        pagination: true,
        search: false,
        sort: true
    }).render(document.getElementById('product-table'));

    // Filter functionality: event listeners for input and filter dropdowns
    document.getElementById('search-input').addEventListener('input', (e) => applyFilters());
    document.getElementById('category-filter').addEventListener('change', (e) => applyFilters());
    document.getElementById('status-filter').addEventListener('change', (e) => applyFilters());
    document.getElementById('stock-filter').addEventListener('change', (e) => applyFilters());
    document.getElementById('sort-filter').addEventListener('change', (e) => applyFilters());

    // Function to apply search and filter logic
    function applyFilters() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const stockFilter = document.getElementById('stock-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;

        const filteredData = productsData.filter(row => {
            const productName = row[1].toLowerCase();
            const category = row[8].toLowerCase();
            const status = row[5].toLowerCase();
            const stock = row[4].toLowerCase();

            let formattedStock = "";
            if (row[4] === "In Stock") {
                formattedStock = "in-stock";
            } else if (row[4] === "Out of Stock") {
                formattedStock = "out-of-stock";
            }
            else if (row[4] === "Out of Stock") {
                formattedStock = "out-of-stock";
            }

            const searchCondition = productName.includes(searchInput);
            const categoryCondition = categoryFilter === '' || categoryFilter === 'all' || category === categoryFilter;
            const statusCondition = statusFilter === '' || statusFilter === 'all' || status === statusFilter;
            const stockCondition = stockFilter === '' || stockFilter === 'all' || formattedStock === stockFilter;

            return searchCondition && categoryCondition && statusCondition && stockCondition;
        });

        if (sortFilter) {
            if (sortFilter === 'date') {
                filteredData.sort((a, b) => new Date(b[7]) - new Date(a[7]));
            } else if (sortFilter === 'price') {
                filteredData.sort((a, b) => parseFloat(b[3].replace('$', '')) - parseFloat(a[3].replace('$', '')));
            } else if (sortFilter === 'name') {
                filteredData.sort((a, b) => a[1].localeCompare(b[1]));
            }
        }

        grid.updateConfig({
            data: filteredData
        }).forceRender();

          // Handle the display of the "No matches found" row
          const gridContainer = document.getElementById('product-table');
          const tableBody = gridContainer.querySelector('.gridjs-tbody');

          // Clear previous "No matches found" row
          const noMatchesRow = document.getElementById('no-matches-row');
          if (noMatchesRow) {
              noMatchesRow.remove();
          }

          // If no results after filtering, create and append a "No matches found" row
          if (filteredData.length === 0) {
              const tr = document.createElement('tr');
              tr.id = 'no-matches-row';

              // Create a single cell spanning all columns
              const td = document.createElement('td');
              td.colSpan = 9; // Adjust the colspan to match the number of columns
              td.style.textAlign = 'center';
              td.textContent = 'No matching records found';
              td.style.fontWeight = '500';
              td.style.color = 'var(--default-text-color)';
              td.style.padding = '12px';

              tr.appendChild(td);
              tableBody.appendChild(tr);
          }
    }

})();
