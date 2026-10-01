var e=class{constructor(e){this.element=e,this.value=parseInt(e.getAttribute(`data-value`))||0,this.size=parseInt(e.getAttribute(`data-size`))||100,this.color=e.getAttribute(`data-color`)||`#0d6efd`,this.color2=e.getAttribute(`data-color2`),this.color3=e.getAttribute(`data-color3`),this.imgSrc=e.getAttribute(`data-img-src`),this.text=e.getAttribute(`data-text`),this.strokeWidth=e.hasAttribute(`data-stroke-width`)?parseInt(e.getAttribute(`data-stroke-width`)):6,this.bgStrokeWidth=e.hasAttribute(`data-bg-stroke-width`)?parseInt(e.getAttribute(`data-bg-stroke-width`)):this.strokeWidth,this.bgColor=e.getAttribute(`data-bg-color`)||`#eee`,this.init(),this.animate()}init(){let e=this.size/2-Math.max(this.strokeWidth,this.bgStrokeWidth)/2,t=2*Math.PI*e,n=t-this.value/100*t,r=this.color2?`progress-gradient-${Math.random().toString(36).substr(2,9)}`:null,i=this.color2?`url(#${r})`:this.color,a=this.color2?`
            <defs>
                <linearGradient id="${r}" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="${this.color}" />
                    ${this.color3?`<stop offset="50%" stop-color="${this.color2}" /><stop offset="100%" stop-color="${this.color3}" />`:`<stop offset="100%" stop-color="${this.color2}" />`}
                </linearGradient>
            </defs>
        `:``,o=this.imgSrc?`<img class="progress-circle-img" src="${this.imgSrc}" alt="Progress image">`:`<div class="animate-count">0%</div>${this.text?`<div class="small">${this.text}</div>`:``}`;this.element.style.width=`${this.size}px`,this.element.style.height=`${this.size}px`,this.element.innerHTML=`
            <svg width="${this.size}" height="${this.size}" viewBox="0 0 ${this.size} ${this.size}">
                ${a}
                ${this.bgStrokeWidth>0?`<circle class="progress-bg" 
                        cx="${this.size/2}" 
                        cy="${this.size/2}" 
                        r="${e}" 
                        stroke="${this.bgColor}" 
                        stroke-width="${this.bgStrokeWidth}"/>`:``}
                <circle class="progress-fill" 
                        cx="${this.size/2}" 
                        cy="${this.size/2}" 
                        r="${e}" 
                        stroke="${i}" 
                        stroke-width="${this.strokeWidth}" 
                        stroke-dasharray="${t}" 
                        stroke-dashoffset="${t}"/>
            </svg>
            <div class="progress-text">
                <div class="progress-text-inner">
                    ${o}
                </div>
            </div>
        `,this.fillElement=this.element.querySelector(`.progress-fill`),this.countElement=this.element.querySelector(`.animate-count`),this.radius=e,this.circumference=t,this.offset=n}animate(){setTimeout(()=>{if(this.fillElement.style.strokeDashoffset=this.offset,!this.countElement)return;let e=0,t=this.value,n=t/(1e3/16),r=setInterval(()=>{e+=n,e>=t&&(e=t,clearInterval(r)),this.countElement.textContent=Math.round(e)+`%`},16)},100)}};document.addEventListener(`DOMContentLoaded`,function(){document.querySelectorAll(`.progress-circle`).forEach(t=>{new e(t)})});