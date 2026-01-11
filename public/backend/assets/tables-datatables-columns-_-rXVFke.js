import"./app-COk2rsMN.js";import"./jquery-Cf4urtAG.js";import{D as c}from"./dataTables-B0hqE2FT.js";import"./dataTables-B10t76VE.js";import"./dataTables.responsive-DNM-A1yC.js";document.addEventListener("DOMContentLoaded",function(){const e=document.getElementById("show-hide-column");if(e){const r=new c(e,{responsive:!0,dom:"<'md:flex justify-between items-center mt-base mb-3'<'columnToggleWrapper'B>f>rt<'md:flex justify-between items-center mt-base'lp>",language:{paginate:{first:'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 7l-5 5l5 5" /><path d="M17 7l-5 5l5 5" /></svg>',previous:'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>',next:'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>',last:'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7l5 5l-5 5" /><path d="M13 7l5 5l-5 5" /></svg>'}}}),i=["Company","Symbol","Price","Change","Volume","Market Cap","Rating","Status"],l=document.querySelector(".columnToggleWrapper");if(l){const n=document.createElement("div");n.className="hs-dropdown [--auto-close:inside] relative inline-flex",n.innerHTML=`
        <button class="hs-dropdown-toggle btn btn-sm bg-secondary text-white" type="button">
            Show/Hide Columns
        </button>
        <ul class="hs-dropdown-menu" id="columnToggleMenu">
            ${i.map((t,o)=>`
                <li class="dropdown-item">
                    <div class="flex items-center gap-2">
                        <input class="form-checkbox form-checkbox-light mt-0 toggle-vis" 
                               type="checkbox" data-column="${o}" id="colToggle${o}" checked>
                        <label class="form-check-label font-medium" for="colToggle${o}">
                            ${t}
                        </label>
                    </div>
                </li>
            `).join("")}
        </ul>
    `,l.appendChild(n),document.getElementById("columnToggleMenu").addEventListener("change",function(t){if(t.target.classList.contains("toggle-vis")){const o=parseInt(t.target.dataset.column,10);r.column(o).visible(t.target.checked)}})}}});const s=()=>{document.querySelectorAll(".dt-paging-button").forEach(e=>{e.classList.contains("current")?e.style.setProperty("color","white","important"):e.style.removeProperty("color")})};setTimeout(s,200);document.addEventListener("click",e=>{e.target.closest(".dt-paging-button")&&setTimeout(s,200)});
