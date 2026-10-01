import "../../admin.bundle-DOCqQWIh.js";import "../../main-BSp6wgyE.js";/* empty css                               */document.addEventListener(`DOMContentLoaded`,function(){e(),_(),s(),d(),t(),n(),window.resetForm=h,window.saveAsDraft=m,window.removeImagePreview=u});function e(){let e=document.getElementById(`productCreateForm`);if(e){e.addEventListener(`submit`,r);let t=document.getElementById(`productName`),n=document.getElementById(`productDescription`),i=document.getElementById(`productMetaTitle`),a=document.getElementById(`productMetaDescription`);t&&i&&t.addEventListener(`input`,function(){i.value||(i.value=this.value,v(i,60-this.value.length,60,`metaTitleCount`))}),n&&a&&n.addEventListener(`input`,function(){a.value||(a.value=this.value.substring(0,160),v(a,160-this.value.length,160,`metaDescCount`))})}}function t(){let e=document.getElementById(`productCreateForm`),t=document.querySelector(`.progress-bar`),n=document.getElementById(`progressText`);if(e&&t&&n){let r=e.querySelectorAll(`[required]`),i=r.length;function a(){let e=0;r.forEach(t=>{t.value.trim()!==``&&e++});let a=Math.round(e/i*100);t.style.width=a+`%`,n.textContent=a+`% Complete`,a<25?t.className=`progress-bar bg-danger`:a<50?t.className=`progress-bar bg-warning`:a<75?t.className=`progress-bar bg-info`:t.className=`progress-bar bg-success`}r.forEach(e=>{e.addEventListener(`input`,a),e.addEventListener(`change`,a)}),a()}}function n(){document.querySelectorAll(`.upload-area`).forEach(e=>{e.addEventListener(`dragover`,function(e){e.preventDefault(),this.style.borderColor=`#007bff`,this.style.backgroundColor=`#f8f9fa`}),e.addEventListener(`dragleave`,function(e){e.preventDefault(),this.style.borderColor=``,this.style.backgroundColor=``}),e.addEventListener(`drop`,function(e){e.preventDefault(),this.style.borderColor=``,this.style.backgroundColor=``;let t=e.dataTransfer.files;if(t.length>0){let e=this.closest(`label`).querySelector(`input[type="file"]`);e&&(e.files=t,e.dispatchEvent(new Event(`change`)))}})})}function r(e){if(e.preventDefault(),i()){let t=new FormData(e.target),n=Object.fromEntries(t.entries());n.productFeatured=document.getElementById(`productFeatured`).checked,n.productFreeShipping=document.getElementById(`productFreeShipping`).checked;let r=e.target.querySelector(`button[type="submit"]`),i=r.innerHTML;r.innerHTML=`<i class="mgc_loading_4_line me-2"></i>Creating Product...`,r.disabled=!0,setTimeout(()=>{p(n),r.innerHTML=i,r.disabled=!1},2e3)}}function i(){let e=[`productName`,`productCategory`,`productDescription`,`productPrice`,`productStock`,`productMainImage`],t=!0;e.forEach(e=>{let n=document.getElementById(e);n&&!n.value.trim()?(a(n,`This field is required`),t=!1):n&&o(n)});let n=document.getElementById(`productPrice`),r=document.getElementById(`productSalePrice`);n&&r&&n.value&&r.value&&parseFloat(r.value)>=parseFloat(n.value)&&(a(r,`Sale price must be less than regular price`),t=!1);let i=document.getElementById(`productStock`);return i&&i.value<0&&(a(i,`Stock quantity cannot be negative`),t=!1),t}function a(e,t){o(e),e.classList.add(`is-invalid`);let n=document.createElement(`div`);n.className=`invalid-feedback`,n.textContent=t,e.parentNode.appendChild(n)}function o(e){e.classList.remove(`is-invalid`);let t=e.parentNode.querySelector(`.invalid-feedback`);t&&t.remove()}function s(){let e=document.getElementById(`productMainImage`),t=document.getElementById(`productGallery`);e&&e.addEventListener(`change`,function(e){c(this,`mainImagePreview`)}),t&&t.addEventListener(`change`,function(e){l(this,`galleryPreview`)})}function c(e,t){if(e.files&&e.files[0]){let n=new FileReader;n.onload=function(n){let r=document.getElementById(t);r||(r=document.createElement(`div`),r.id=t,r.className=`mt-3`,e.closest(`label`).appendChild(r)),r.innerHTML=`
                <div class="position-relative d-inline-block">
                    <img src="${n.target.result}" class="img-thumbnail shadow-sm" style="max-width: 200px; max-height: 200px; object-fit: cover;">
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle" 
                            onclick="removeImagePreview('${t}')" style="margin: 5px; width: 30px; height: 30px;">
                        <i class="mgc_close_line"></i>
                    </button>
                    <div class="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white p-2">
                        <small>${e.files[0].name}</small>
                    </div>
                </div>
            `;let i=e.closest(`label`).querySelector(`.upload-area`);i&&(i.innerHTML=`
                    <span class="avatar size-12 bg-success-subtle rounded-circle mx-auto mb-3">
                        <i class="mgc_check_line text-success fs-5"></i>
                    </span>
                    <span class="d-block text-success mt-2 mb-1">Image uploaded successfully!</span>
                    <small class="text-muted">Click to change image</small>
                `)},n.readAsDataURL(e.files[0])}}function l(e,t){if(e.files&&e.files.length>0){let n=document.getElementById(t);n||(n=document.createElement(`div`),n.id=t,n.className=`mt-3`,e.closest(`label`).appendChild(n)),n.innerHTML=``,Array.from(e.files).forEach((e,r)=>{let i=new FileReader;i.onload=function(i){let a=document.createElement(`div`);a.className=`position-relative d-inline-block me-3 mb-3`,a.innerHTML=`
                    <img src="${i.target.result}" class="img-thumbnail shadow-sm" style="max-width: 150px; max-height: 150px; object-fit: cover;">
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle" 
                            onclick="removeImagePreview('${t}', ${r})" style="margin: 5px; width: 30px; height: 30px;">
                        <i class="mgc_close_line"></i>
                    </button>
                    <div class="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white p-2">
                        <small>${e.name}</small>
                    </div>
                `,n.appendChild(a)},i.readAsDataURL(e)});let r=e.closest(`label`).querySelector(`.upload-area`);r&&(r.innerHTML=`
                <span class="avatar size-12 bg-success-subtle rounded-circle mx-auto mb-3">
                    <i class="mgc_check_line text-success fs-5"></i>
                </span>
                <span class="d-block text-success mt-2 mb-1">${e.files.length} images uploaded!</span>
                <small class="text-muted">Click to add more images</small>
            `)}}function u(e,t=null){let n=document.getElementById(e);if(n){if(t!==null){let e=n.querySelectorAll(`.position-relative`);e[t]&&e[t].remove()}else n.remove();let e=n.closest(`label`).querySelector(`input[type="file"]`);if(e){e.value=``;let t=e.closest(`label`).querySelector(`.upload-area`);t&&(e.id===`productMainImage`?t.innerHTML=`
                        <span class="avatar size-12 bg-primary-subtle rounded-circle mx-auto mb-3">
                            <i class="mgc_upload_2_line text-primary fs-5"></i>
                        </span>
                        <span class="d-block text-muted mt-2 mb-1">Click to upload main image</span>
                        <small class="text-muted">Recommended: 1:1 pixels, JPG/PNG</small>
                    `:t.innerHTML=`
                        <span class="avatar size-12 bg-primary-subtle rounded-circle mx-auto mb-3">
                            <i class="mgc_upload_2_line text-primary fs-5"></i>
                        </span>
                        <span class="d-block text-muted mt-2 mb-1">Click to upload multiple images</span>
                        <small class="text-muted">Drag & drop or click to select</small>
                    `)}}}function d(){let e=document.getElementById(`productName`),t=document.getElementById(`productSKU`);e&&t&&e.addEventListener(`input`,function(){t.value||=f(this.value)})}function f(e){if(!e)return``;let t=Date.now().toString().slice(-4);return`${e.toUpperCase().replace(/[^A-Z0-9]/g,``).substring(0,6)}${t}`}function p(e){console.log(`Creating product:`,e),g(`🎉 Product created successfully!`,`success`),h()}function m(){let e=document.getElementById(`productCreateForm`);if(e){let t=new FormData(e),n=Object.fromEntries(t.entries());n.productStatus=`draft`,n.productFeatured=document.getElementById(`productFeatured`).checked,n.productFreeShipping=document.getElementById(`productFreeShipping`).checked,g(`💾 Product saved as draft!`,`success`)}}function h(){let e=document.getElementById(`productCreateForm`);if(e){e.reset();let n=document.getElementById(`mainImagePreview`),r=document.getElementById(`galleryPreview`);n&&n.remove(),r&&r.remove(),e.querySelectorAll(`.is-invalid`).forEach(e=>{e.classList.remove(`is-invalid`)}),e.querySelectorAll(`.invalid-feedback`).forEach(e=>{e.remove()}),e.querySelectorAll(`.upload-area`).forEach((e,t)=>{t===0?e.innerHTML=`
                    <span class="avatar size-12 bg-primary-subtle rounded-circle mx-auto mb-3">
                        <i class="mgc_upload_2_line text-primary fs-5"></i>
                    </span>
                    <span class="d-block text-muted mt-2 mb-1">Click to upload main image</span>
                    <small class="text-muted">Recommended: 1:1 pixels, JPG/PNG</small>
                `:e.innerHTML=`
                    <span class="avatar size-12 bg-primary-subtle rounded-circle mx-auto mb-3">
                        <i class="mgc_upload_2_line text-primary fs-5"></i>
                </span>
                    <span class="d-block text-muted mt-2 mb-1">Click to upload multiple images</span>
                    <small class="text-muted">Drag & drop or click to select</small>
                `}),t()}}function g(e,t=`info`){let n=document.createElement(`div`);n.className=`alert alert-${t} alert-dismissible fade show position-fixed`,n.style.cssText=`top: 20px; right: 20px; z-index: 9999; min-width: 350px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);`,n.innerHTML=`
        <div class="d-flex align-items-center">
            <div class="me-3">
                ${t===`success`?`🎉`:t===`warning`?`⚠️`:t===`danger`?`❌`:`ℹ️`}
            </div>
            <div class="flex-grow-1">
                ${e}
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `,document.body.appendChild(n),setTimeout(()=>{n.parentNode&&n.remove()},5e3)}function _(){let e=document.getElementById(`productPrice`),t=document.getElementById(`productSalePrice`);e&&t&&[e,t].forEach(n=>{n.addEventListener(`input`,function(){e.value&&t.value&&(parseFloat(t.value)>=parseFloat(e.value)?a(t,`Sale price must be less than regular price`):o(t))})});let n=document.getElementById(`productMetaTitle`),r=document.getElementById(`productMetaDescription`);n&&n.addEventListener(`input`,function(){let e=60-this.value.length;v(this,e,60,`metaTitleCount`)}),r&&r.addEventListener(`input`,function(){let e=160-this.value.length;v(this,e,160,`metaDescCount`)})}function v(e,t,n,r){let i=document.getElementById(r);i&&(i.className=`text-muted ${t<0?`text-danger`:t<10?`text-warning`:`text-muted`}`,i.textContent=`${Math.max(0,t)}/${n}`,t<0?e.classList.add(`is-invalid`):e.classList.remove(`is-invalid`))}document.addEventListener(`DOMContentLoaded`,function(){let e=document.querySelectorAll(`#Basic, #Pricing, #Images, #SEO, #Additional`),t=document.querySelectorAll(`.nav-link`);function n(){let n=``;e.forEach(e=>{let t=e.offsetTop-120,r=e.offsetHeight;window.scrollY>=t&&window.scrollY<t+r&&(n=e.getAttribute(`id`))}),t.forEach(e=>{e.classList.remove(`active`),e.getAttribute(`data-section`)===n&&e.classList.add(`active`)})}window.addEventListener(`scroll`,n)}),VirtualSelect.init({ele:`#productCategory`,options:[{label:`Select a category`,value:`Select a category`},{label:`Electronics`,value:`Electronics`},{label:`Clothing & Fashion`,value:`Clothing & Fashion`},{label:`Books & Media`,value:`Books & Media`},{label:`Home & Garden`,value:`Home & Garden`},{label:`Sports & Outdoors`,value:`Sports & Outdoors`},{label:`Beauty & Health`,value:`Beauty & Health`},{label:`Automotive`,value:`Automotive`},{label:`Toys & Games`,value:`Toys & Games`}],allowNewOption:!0}),VirtualSelect.init({ele:`#productStatus`,options:[{label:`Active - Visible to customers`,value:`Active - Visible to customers`},{label:`Draft - Hidden from customers`,value:`Draft - Hidden from customers`},{label:`Archived - Hidden from all`,value:`Archived - Hidden from all`}],allowNewOption:!0}),VirtualSelect.init({ele:`#productVisibility`,options:[{label:`Visible - Show everywhere`,value:`Visible - Show everywhere`},{label:`Hidden - Admin only`,value:`Hidden - Admin only`},{label:`Catalog - Show in catalog only`,value:`Catalog - Show in catalog only`},{label:`Search - Show in search only`,value:`Search - Show in search only`}],allowNewOption:!0}),VirtualSelect.init({ele:`#shippingType`,options:[{label:`Flat Rate`,value:`Flat Rate`},{label:`Free Shipping`,value:`Free Shipping`},{label:`Calculated by Weight`,value:`Calculated by Weight`}],allowNewOption:!0});