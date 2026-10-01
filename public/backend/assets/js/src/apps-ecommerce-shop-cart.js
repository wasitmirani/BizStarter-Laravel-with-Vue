import "../../admin.bundle-DOCqQWIh.js";import "../../main-BSp6wgyE.js";import{a as e,i as t,n,r,t as i}from"../../product-04-54FIMQ7V.js";var a=document.getElementById(`timeToLeftPage`),o=300,s=setInterval(function(){let e=Math.floor(o/60),t=o%60;a.textContent=`${e}:${t<10?`0`:``}${t}`,o--,o<0&&(clearInterval(s),window.location.href=`apps-ecommerce-products-list.html`)},1e3),c=[{id:1,category:`Woman's Fashion`,categoryColor:`primary`,title:`Tie-Up Neck Top`,image:e,price:22.12,originalPrice:29.49,discount:25,quantity:1,selectedSize:`S`,selectedColor:`White`},{id:2,category:`Footwear`,title:`Elegantly Rounded Shoes`,image:t,price:71.56,quantity:2,selectedSize:`6`,selectedColor:`Light Blue`},{id:3,category:`Men's Fashion`,title:`Oversize Cotton Graphic T-Shirt`,image:r,price:44.49,quantity:1,selectedSize:`XL`,selectedColor:`Gray`},{id:4,category:`Woman's Fashion`,title:`Slim Fit Printed Top`,image:n,price:67.99,quantity:1,selectedSize:`L`,selectedColor:`Black`},{id:5,category:`Electronics`,title:`Smart Watch Series 7`,image:i,price:199.99,quantity:1,selectedSize:`XL`,selectedColor:`Midnight`}];function l(){let e=document.getElementById(`cartProductList`);e.innerHTML=``,c.forEach(t=>{let n=(t.price*t.quantity).toFixed(2),r=document.createElement(`tr`);r.setAttribute(`data-id`,t.id),r.innerHTML=`
            <td>
                <div class="d-flex align-items-center gap-5">
                    <div class="size-20 bg-light-subtle avatar rounded p-1">
                        <img src="${t.image}" loading="lazy" alt="Product Image" class="img-fluid">
                    </div>
                    <div>
                        <h6 class="mb-2"><a href="apps-ecommerce-product-overview.js" class="text-body">${t.title}</a></h6>
                        <p class="text-muted mb-1 fs-15">Color: <span class="text-body fw-medium"> ${t.selectedColor}</span></p>
                        <p class="text-muted mb-0 fs-15">Size: <span class="text-body fw-medium">${t.selectedSize}</span></p>
                    </div>
                </div>
            </td>
            <td>$${t.price}</td>
            <td>
                <div class="input-spin-group input-borderless p-1 border rounded w-fit">
                    <button type="button" aria-label="Minus" class="input-spin-minus btn bg-primary-subtle text-primary px-2 border-0 size-8 d-flex justify-content-center align-items-center" data-id="${t.id}"><i class="mgc_minimize_line"></i></button>
                    <input type="text" class="input-spin form-control text-center border-0 h-8 quantity-display" readonly value="${t.quantity}">
                    <button type="button" aria-label="Plus" class="input-spin-plus btn bg-primary-subtle text-primary px-2 border-0 size-8 d-flex justify-content-center align-items-center" data-id="${t.id}"><i class="mgc_add_line"></i></button>
                </div>
            </td>
            <td class="price-display fw-semibold fs-15">$${n}</td>
            <td class="text-center pe-5">
                <div class="d-flex justify-content-center gap-2">
                    <button type="button" aria-label="Wishlist" class="btn btn-icon btn-outline-light size-8"><i class="mgc_heart_line"></i></button>
                    <button type="button" aria-label="Remove" class="btn btn-icon btn-sub-danger size-8 remove-item"><i class="mgc_close_line"></i></button>
                </div>
            </td>
        `,e.appendChild(r)}),u()}function u(){document.querySelectorAll(`.input-spin-minus`).forEach(e=>{e.addEventListener(`click`,()=>{let t=+e.dataset.id,n=c.find(e=>e.id===t);if(n.quantity>1){n.quantity--;let t=e.closest(`tr`);t.querySelector(`.quantity-display`).value=n.quantity,t.querySelector(`.price-display`).textContent=`$${(n.price*n.quantity).toFixed(2)}`,d()}})}),document.querySelectorAll(`.input-spin-plus`).forEach(e=>{e.addEventListener(`click`,()=>{let t=+e.dataset.id,n=c.find(e=>e.id===t);n.quantity++;let r=e.closest(`tr`);r.querySelector(`.quantity-display`).value=n.quantity,r.querySelector(`.price-display`).textContent=`$${(n.price*n.quantity).toFixed(2)}`,d()})}),document.querySelectorAll(`.remove-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`tr`),n=+t.dataset.id,r=c.findIndex(e=>e.id===n);r!==-1&&(c.splice(r,1),t.remove(),d())})})}function d(){let e=c.reduce((e,t)=>e+t.price*t.quantity,0),t=e*.06,n=e*.1,r=e+t+35-n;document.getElementById(`subtotal`).textContent=e.toFixed(2),document.getElementById(`vat`).textContent=t.toFixed(2),document.getElementById(`discount`).textContent=n.toFixed(2),document.getElementById(`shipping`).textContent=35 .toFixed(2),document.getElementById(`total`).textContent=r.toFixed(2)}document.addEventListener(`DOMContentLoaded`,()=>{l(),d()});