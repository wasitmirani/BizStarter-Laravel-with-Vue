window.onload = function () {
    const listWrapper = document.querySelector(".list-wrapper");
    let isotope;

    if (listWrapper) {
        isotope = new Isotope(listWrapper, {
            itemSelector: ".card-item",
            // layoutMode: 'fitRows',
        });
    }

    const categoriesFilter = document.querySelectorAll(".pos-category");
    if (categoriesFilter.length > 0) {
        categoriesFilter.forEach(function (filter) {
            filter.addEventListener("click", function (event) {
                if (event.target.matches(".categories")) {
                    const filterValue = event.target.getAttribute("data-filter");
                    if (filterValue) {
                        isotope.arrange({ filter: filterValue });
                        isotope.layout(); // Force a re-layout after filtering
                    }
                }
            });
        });
    }

    var cards = document.querySelectorAll('.pos-category-card');
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            cards.forEach(function (c) {
                c.classList.remove('active');
            });
            card.classList.add('active');
        });
    });
};

document.querySelectorAll("#switcher-boxed , #switcher-full-width ,#switcher-default-width, #reset-all").forEach((element) => {
    element.addEventListener("click", () => {
        setTimeout(() => {
            console.log("working");
            new Isotope(document.querySelector(".list-wrapper"), {
                itemSelector: ".card-item",
            });
        }, 100);
    })
})


// for nummber of products selected 
var value = 1, minValue = 0, maxValue = 30;

let productMinusBtn1 = document.querySelectorAll(".product-quantity-minus")
let productPlusBtn1 = document.querySelectorAll(".product-quantity-plus")
productMinusBtn1.forEach((element) => {
    element.onclick = () => {
        value = Number(element.parentElement.childNodes[3].value)
        if (value > minValue) {
            value = Number(element.parentElement.childNodes[3].value) - 1;
            element.parentElement.childNodes[3].value = value;
        }
    }
})
productPlusBtn1.forEach((element) => {
    element.onclick = () => {
        if (value < maxValue) {
            value = Number(element.parentElement.childNodes[3].value) + 1;
            element.parentElement.childNodes[3].value = value;
        }
    }
})