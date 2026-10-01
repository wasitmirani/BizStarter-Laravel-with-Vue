import "../../admin.bundle-DOCqQWIh.js";import "../../main-BSp6wgyE.js";import "../../progress-circle.init-BEuzsGsH.js";import{t as e}from"../../user-5-C3H4ADBs.js";import{t}from"../../user-10-B2oCvcle.js";var n=``+new URL(`..//assets/images/user-15.webp`,import.meta.url).href,r=``+new URL(`..//assets/images/user-20.webp`,import.meta.url).href,i=``+new URL(`..//assets/images/user-25.webp`,import.meta.url).href;document.addEventListener(`DOMContentLoaded`,function(){document.querySelectorAll(`.post-text`).forEach(function(e){let t=e.getAttribute(`data-full`);e.getAttribute(`data-short`);let n=e.querySelector(`.see-more`);n&&n.addEventListener(`click`,function(n){n.preventDefault(),e.innerHTML=t})})});var a=[{name:`Edilson De Carvalho`,avatar:e,date:`Today`,messageBox:!0},{name:`Tommy Beahan`,avatar:t,date:`Tomorrow`},{name:`Sheila Parker`,avatar:n,date:`19 Feb`},{name:`Peggy Ernser`,avatar:r,date:`20 Feb`},{name:`Nora Keebler`,avatar:i,date:`21 Feb`}],o=!1;function s(){let e=document.getElementById(`birthdayList`),t=document.getElementById(`upcomingSummary`),n=``;(o?a:[a[0]]).forEach(e=>{n+=`
      <div class="d-flex align-items-center">
        <img src="${e.avatar}" class="rounded-circle size-10 me-3" alt="">
        <div>
          <h6 class="mb-0">${e.name}</h6>
          <small class="text-muted">${e.date===`Today`?`Birthday today`:e.date}</small>
        </div>
      </div>
    `}),e.innerHTML=n,o?t.innerHTML=``:t.innerHTML=`
      <div class="d-flex align-items-center bg-light rounded p-2">
        <div class="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 36px; height: 36px;">
          <i class="mgc_gift_2_line text-primary fs-5"></i>
        </div>
        <div>
          <div class="fw-medium">Upcoming birthdays</div>
          <small class="text-muted">See ${a.length-1} others have upcoming birthdays</small>
        </div>
      </div>
    `,document.getElementById(`birthdayMessageBox`).style.display=!o&&a[0].messageBox?`flex`:`none`}document.addEventListener(`DOMContentLoaded`,function(){s(),document.getElementById(`seeAllBirthdays`).addEventListener(`click`,function(e){e.preventDefault(),o=!o,this.textContent=o?`Show Less`:`See All`,s()})});
