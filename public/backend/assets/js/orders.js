(function () {
    "use strict"

    // Sample Data
    const ordersData = [
        ['#SPK001', 'John Doe', '../assets/images/faces/9.jpg', '$699.99', 'Pending', 'Pending', 'Visa Card', 'Jan 15, 2025, 09:45 AM', 'john.doe@example.com'],
        ['#SPK002', 'Jane Smith', '../assets/images/faces/1.jpg', '$89.99', 'Shipped', 'Completed', 'MasterCard', 'Feb 3, 2025, 02:30 PM', 'jane.smith@example.com'],
        ['#SPK003', 'Michael Brown', '../assets/images/faces/10.jpg', '$399.99', 'Delivered', 'Failed', 'PayPal', 'Mar 10, 2025, 11:15 AM', 'michael.brown@example.com'],
        ['#SPK004', 'Emily White', '../assets/images/faces/2.jpg', '$129.99', 'Cancelled', 'Refunded', 'Apple Pay', 'Apr 5, 2025, 04:00 PM', 'emily.white@example.com'],
        ['#SPK005', 'Chris Johnson', '../assets/images/faces/11.jpg', '$199.99', 'Shipped', 'Cancelled', 'COD', 'May 1, 2025, 10:30 AM', 'chris.johnson@example.com'],
        ['#SPK006', 'Sarah Lee', '../assets/images/faces/3.jpg', '$149.99', 'Delivered', 'Refunded', 'MasterCard', 'Jun 10, 2025, 03:45 PM', 'sarah.lee@example.com'],
        ['#SPK007', 'David Green', '../assets/images/faces/13.jpg', '$79.99', 'Delivered', 'Completed', 'PayPal', 'Jul 18, 2025, 01:00 PM', 'david.green@example.com'],
        ['#SPK008', 'Olivia Davis', '../assets/images/faces/4.jpg', '$59.99', 'Pending', 'Pending', 'American Express', 'Aug 25, 2025, 12:30 PM', 'olivia.davis@example.com'],
        ['#SPK009', 'James Wilson', '../assets/images/faces/14.jpg', '$59.99', 'Cancelled', 'Completed', 'Visa Card', 'Sep 5, 2025, 06:00 PM', 'james.wilson@example.com'],
        ['#SPK010', 'Sophia Martinez', '../assets/images/faces/5.jpg', '$39.99', 'Shipped', 'Failed', 'COD', 'Oct 12, 2025, 08:15 AM', 'sophia.martinez@example.com']
    ];

    const grid = new gridjs.Grid({
        columns: [
            {
                name: '#',
                formatter: (_, row) => gridjs.html(
                    `<input class="form-check-input" type="checkbox" id="order-${row.cells[0].data}" value="" aria-label="...">`
                )
            },
            {
                name: 'Order ID',
                formatter: (_, row) => gridjs.html(
                    `<a href="javascript:void(0);" class="text-primary text-decoration-underline">${row.cells[0].data}</a>`  // Correctly map to Order ID (row[0])
                )
            },
            {
                name: 'Customer',
                formatter: (_, row) => gridjs.html(
                    `<a href="order-details.php">
                        <div class="d-flex align-items-center gap-3 position-relative">
                            <div class="lh-1">
                                <span class="avatar avatar-md avatar-rounded">
                                    <img src="${row.cells[2].data}" alt="User Image">
                                </span>
                            </div>
                            <div>
                                <span class="d-block fw-semibold">${row.cells[1].data}</span>
                                <span class="text-muted fs-13">${row.cells[8].data}</span>
                            </div>
                        </div>
                    </a>`
                )
            },
            'Price',
            {
                name: 'Delivery Status',
                formatter: (_, row) => gridjs.html(
                    `<span class="badge bg-${row.cells[4].data === 'Pending' ? 'warning' : row.cells[4].data === 'Shipped' ? 'info' : row.cells[4].data === 'Delivered' ? 'primary' : 'danger'}-transparent">${row.cells[4].data}</span>`
                )
            },
            {
                name: 'Payment Method',
                formatter: (_, row) => gridjs.html(
                    `${row.cells[6].data}`
                )
            },
            {
                name: 'Payment Status',
                formatter: (_, row) => gridjs.html(
                    `<span class="text-${row.cells[5].data === 'Pending' ? 'info' : row.cells[5].data === 'Completed' ? 'primary' : row.cells[5].data === 'Failed' ? 'orange' : row.cells[5].data === 'Refunded' ? 'warning' : 'danger'}">${row.cells[5].data}</span>`
                )
            },
            'Ordered Date',
            {
                name: 'Actions',
                formatter: (_, row) => gridjs.html(`
                    <div class="dropdown">
                        <a href="javascript:void(0);" class="btn btn-icon btn-sm btn-primary-light border" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fe fe-more-vertical"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="order-details.php"><i class="ri-eye-line me-2"></i>View</a></li>
                            <li><a class="dropdown-item btn-delete" href="javascript:void(0);"><i class="ri-delete-bin-line me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                `)
            }
        ],
        data: ordersData,
        pagination: true,
        search: false,
        sort: true
    }).render(document.getElementById('orders-table'));

    // Filter functionality: event listeners for input and filter dropdowns
    document.getElementById('search-input').addEventListener('input', (e) => applyFilters());
    document.getElementById('delivery-status-filter').addEventListener('change', (e) => applyFilters());
    document.getElementById('payment-status-filter').addEventListener('change', (e) => applyFilters());

    // Function to apply search and filter logic
    function applyFilters() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const paymentstatusFilter = document.getElementById('payment-status-filter').value;
        const deliverystatusFilter = document.getElementById('delivery-status-filter').value;

        const filteredData = ordersData.filter(row => {
            const customerName = row[1].toLowerCase();

            let deliveryStatus = "";
            if (row[4] === "Pending") {
                deliveryStatus = "pending";
            } else if (row[4] === "Shipped") {
                deliveryStatus = "shipped";
            } else if (row[4] === "Delivered") {
                deliveryStatus = "delivered";
            } else if (row[4] === "Cancelled") {
                deliveryStatus = "cancelled";
            }

            let paymentStatus = "";
            if (row[5] === "Pending") {
                paymentStatus = "pending";
            } else if (row[5] === "Completed") {
                paymentStatus = "completed";
            } else if (row[5] === "Failed") {
                paymentStatus = "failed";
            } else if (row[5] === "Refunded") {
                paymentStatus = "refunded";
            } else if (row[5] === "Cancelled") {
                paymentStatus = "cancelled";
            }

            const searchCondition = customerName.includes(searchInput);
            const paymentCondition = paymentstatusFilter === '' || paymentstatusFilter === 'all' || paymentStatus === paymentstatusFilter;
            const deliveryCondition = deliverystatusFilter === '' || deliverystatusFilter === 'all' || deliveryStatus === deliverystatusFilter;

            return searchCondition && paymentCondition && deliveryCondition;
        });

        grid.updateConfig({
            data: filteredData
        }).forceRender();

        // Handle the display of the "No matches found" row
        const gridContainer = document.getElementById('orders-table');
        const tableBody = gridContainer.querySelector('.gridjs-tbody');

        // Clear previous "No matches found" row
        const notFoundElement = document.querySelector('.gridjs-notfound');
        if (notFoundElement) {
            notFoundElement.style.display = 'none';  // Hide it using JavaScript
        }

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

    // Add a listener for delete actions in the table with SweetAlert confirmation
    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('btn-delete')) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Find the row index of the order to delete
                    const rowIndex = e.target.closest('tr').rowIndex - 1; // Subtract 1 to account for the header row

                    // Remove the order from the ordersData array
                    ordersData.splice(rowIndex, 1);

                    // Update the grid with the new data
                    grid.updateConfig({
                        data: ordersData
                    }).forceRender();

                    Swal.fire(
                        'Deleted!',
                        'Your order has been deleted.',
                        'success'
                    );
                }
            });
        }
    });

})();