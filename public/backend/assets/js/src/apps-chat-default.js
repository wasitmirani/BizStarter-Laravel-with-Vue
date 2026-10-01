import "../../admin.bundle-DOCqQWIh.js";import "../../main-BSp6wgyE.js";var e=document.querySelectorAll(`.chat-list-item`),t=document.querySelector(`.chat-messages`),n=document.querySelector(`#messageForm`);if(n&&t){let r=d,i=`Dawn Teague`,a=n.querySelector(`input[type="text"]`),o=n.querySelector(`.btn-active-primary`),s=n.querySelector(`.dropdown-menu`),c=document.getElementById(`chatSearch`),l=document.querySelectorAll(`.chat-list-item`),u={"Dawn Teague":{avatar:`assets/images/avatar/user-13.webp`,lastSeen:`2 hr`,messages:[{sender:`Dawn Teague`,avatar:`assets/images/avatar/user-13.webp`,time:`Today, 09:59 AM`,content:`We need a new website that allows users to create accounts, browse products, and make purchases. Can you provide a rough timeline and cost estimate?`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Today, 10:00 AM`,content:`Sure, we can help with that. To provide an accurate estimate, we'll need more details on the features you want. Let's schedule a call this week to discuss the specifics, such as the types of products, payment methods, and any design preferences.`,isMe:!0},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Today, 10:15 AM`,content:`Got it. I'll investigate and update you shortly. <a href="#!" class="link-danger">#bug</a>`,isMe:!0},{sender:`Dawn Teague`,avatar:`assets/images/avatar/user-13.webp`,time:`Today, 10:11 AM`,content:`Hi <a href="#!" class="link-primary">@Shopia</a>, can you add the new search feature by Friday? Details are in the #features channel. Thanks! <a href="#!" class="link-primary">#task</a>`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Today, 10:12 AM`,content:`Sure, starting on it today. Will update you on the progress.<a href="#!" class="link-primary">#task154</a>`,isMe:!0},{sender:`Dawn Teague`,avatar:`assets/images/avatar/user-13.webp`,time:`Today, 02:39 PM`,content:`Hi Shopia, there's a problem with the mobile view on the homepage. Images aren't scaling right. Can someone check? <a href="#!" class="link-danger">#bug</a>`,isMe:!1,images:[`assets/images/gallery/img-01.webp`,`assets/images/gallery/img-05.webp`]}]},"David Johnson":{avatar:`assets/images/avatar/user-11.webp`,lastSeen:`1 hr`,messages:[{sender:`David Johnson`,avatar:`assets/images/avatar/user-11.webp`,time:`Today, 08:30 AM`,content:`Here are some of very cute illustration.`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Today, 08:45 AM`,content:`Thanks for sharing! These look great. Do we have permission to use them in our project?`,isMe:!0},{sender:`David Johnson`,avatar:`assets/images/avatar/user-11.webp`,time:`Today, 09:00 AM`,content:`Absolutely, feel free to use them. I'll send you the high-res versions soon.`,isMe:!1}]},"Andrew Gilbert":{avatar:`assets/images/avatar/user-18.webp`,lastSeen:`3 hr`,messages:[{sender:`Andrew Gilbert`,avatar:`assets/images/avatar/user-18.webp`,time:`Yesterday, 03:15 PM`,content:`Use tools like Trello, Asana, or Jira for task management and progress tracking.`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Yesterday, 03:30 PM`,content:`Thanks for the suggestion! I'll look into them.`,isMe:!0},{sender:`Andrew Gilbert`,avatar:`assets/images/avatar/user-18.webp`,time:`Yesterday, 04:00 PM`,content:`Let me know if you need any help setting them up.`,isMe:!1}]},"Tyron Derby":{avatar:`assets/images/avatar/user-20.webp`,lastSeen:`30 min`,messages:[{sender:`Tyron Derby`,avatar:`assets/images/avatar/user-20.webp`,time:`Yesterday, 04:30 PM`,content:`Regularly review and improve communication practices based on team feedback and project needs.`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Yesterday, 04:45 PM`,content:`That's a great point. I'll make sure to gather feedback from the team.`,isMe:!0},{sender:`Tyron Derby`,avatar:`assets/images/avatar/user-20.webp`,time:`Yesterday, 05:00 PM`,content:`Sounds good. Let me know if you need any templates or examples for feedback sessions.`,isMe:!1}]},"Susan Liles":{avatar:``,initials:`SL`,lastSeen:`45 min`,messages:[{sender:`Susan Liles`,avatar:``,initials:`SL`,time:`Yesterday, 05:15 PM`,content:`Schedule regular check-ins to address any roadblocks and keep everyone aligned.`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Yesterday, 05:30 PM`,content:`I'll set that up for next week.`,isMe:!0},{sender:`Susan Liles`,avatar:``,initials:`SL`,time:`Yesterday, 06:00 PM`,content:`Great! Let me know if you need any help organizing the meeting.`,isMe:!1}]},"Josh Doyle":{avatar:``,initials:`JD`,lastSeen:`15 min`,messages:[{sender:`Josh Doyle`,avatar:``,initials:`JD`,time:`Yesterday, 06:00 PM`,content:`No further questions.`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Yesterday, 06:30 PM`,content:`Alright, feel free to reach out if you think of anything else.`,isMe:!0},{sender:`Josh Doyle`,avatar:``,initials:`JD`,time:`Yesterday, 07:00 PM`,content:`Will do, thanks!`,isMe:!1}]},"Nicholas Hope":{avatar:`assets/images/avatar/user-3.webp`,lastSeen:`1 hr`,messages:[{sender:`Nicholas Hope`,avatar:`assets/images/avatar/user-3.webp`,time:`Today, 11:30 AM`,content:`Sure, I can help with that. Let's have a quick call after this meeting to debug the issue.`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Today, 12:00 PM`,content:`Thanks, I'll be ready for the call.`,isMe:!0},{sender:`Nicholas Hope`,avatar:`assets/images/avatar/user-3.webp`,time:`Today, 12:30 PM`,content:`Let's get started then. I'm available now.`,isMe:!1}]},"Louise Bryan":{avatar:``,initials:`LB`,lastSeen:`2 hr`,messages:[{sender:`Louise Bryan`,avatar:``,initials:`LB`,time:`Today, 12:15 PM`,content:`I'll share the meeting minutes and action items shortly.`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Today, 12:45 PM`,content:`Thanks! I'll review them once you share.`,isMe:!0},{sender:`Louise Bryan`,avatar:``,initials:`LB`,time:`Today, 01:00 PM`,content:`I've sent them over, let me know if you have any questions.`,isMe:!1}]},"Sirkka Hakola":{avatar:`assets/images/avatar/user-6.webp`,lastSeen:`3 hr`,messages:[{sender:`Sirkka Hakola`,avatar:`assets/images/avatar/user-6.webp`,time:`Today, 01:00 PM`,content:`Let's reconvene next week for our regular check-in. Have a productive week!`,isMe:!1},{sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:`Today, 01:30 PM`,content:`Thanks, have a great week too!`,isMe:!0},{sender:`Sirkka Hakola`,avatar:`assets/images/avatar/user-6.webp`,time:`Today, 02:00 PM`,content:`Looking forward to our next meeting. Talk soon!`,isMe:!1}]}};function d(t){e.forEach(e=>{e.querySelector(`h6`).textContent===t?e.classList.add(`active`):e.classList.remove(`active`)});let n=u[t]||u[`Dawn Teague`],r=document.querySelector(`.chat-toolbar`),a=r.querySelector(`img`);if(n.avatar){a.src=n.avatar,a.style.display=`block`;let e=r.querySelector(`.initials`);e&&(e.style.display=`none`)}else if(n.initials){a.style.display=`none`;let e=r.querySelector(`.initials`);if(e)e.textContent=n.initials,e.style.display=`block`;else{let e=document.createElement(`span`);e.className=`initials fw-semibold`,e.textContent=n.initials,a.parentNode.appendChild(e)}}r.querySelector(`h6 a`).textContent=t,r.querySelector(`p`).textContent=`Last seen ${n.lastSeen}`;let o=document.querySelector(`#chat-messages`);o.innerHTML=``,n.messages.forEach((e,t)=>{let n=``,r=`msg-${t}`;if(e.isMe)n=`
                <div  id="${r}" class="d-flex align-items-end gap-2 ms-auto max-w-xl">
                  <div class="flex-grow-1 mb-3">
                    <div class="d-flex align-items-end gap-2">
                      <div class="flex-grow-1">
                        <p class="text-muted mb-1 fs-12 text-end">${e.time}</p>
                        <div class="px-4 py-10px bg-light-subtle text-body rounded-top-3 rounded-start-3">${e.content}</div>
                      </div>
                      <div class="dropdown">
                        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" aria-expanded="true" title="dropdown-button">
                          <i class="ri-more-2-fill text-muted"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                          <li>
                            <a href="#!" class="dropdown-item">
                              <i class="ri-reply-line me-1"></i>
                              <span>Reply</span>
                            </a>
                          </li>
                          <li>
                            <a href="#!" class="dropdown-item delete-message" data-id="${r}">
                              <i class="ri-delete-bin-line me-1"></i>
                              <span>Delete</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="position-relative size-8 flex-shrink-0 d-flex justify-content-center align-items-center">
                    <img src="${e.avatar}" alt="" class="img-fluid rounded-circle">
                    <span class="status-indicator position-absolute bottom-0 end-0 bg-success border border-2 border-light-subtle rounded-circle size-2-5"></span>
                  </div>
                </div>
              `;else{let t=``;e.images&&e.images.length>0&&(t=`
                  <div class="row g-2">
                    ${e.images.map((e,t)=>`
                      <div class="col-3">
                        <a href="#!" title="Gallery Image ${t+1}">
                          <img src="${e}" alt="Image ${t+1}" class="img-fluid rounded">
                        </a>
                      </div>
                    `).join(``)}
                    ${e.images.length>2?`
                      <div class="col-3">
                        <a href="#!" title="Gallery Image 3" class="p-3 bg-light-subtle d-flex align-items-center justify-content-center link-body-emphasis text-body rounded h-100">
                          <h6 class="mb-0">${e.images.length-2}+</h6>
                        </a>
                      </div>
                    `:``}
                  </div>
                `);let i=``;e.avatar?i=`<img src="${e.avatar}" alt="" class="img-fluid rounded-circle">`:e.initials&&(i=`<span class="fw-semibold">${e.initials}</span>`),n=`
                <div  id="${r}"class="d-flex align-items-end gap-2 max-w-xl">
                  <div class="position-relative size-8 flex-shrink-0 d-flex justify-content-center align-items-center">
                    ${i}
                    <span class="status-indicator position-absolute bottom-0 end-0 bg-success border border-2 border-light-subtle rounded-circle size-2-5"></span>
                  </div>
                  <div class="flex-grow-1 mb-3">
                    <div class="d-flex align-items-end gap-2 ${t?`mb-3`:``}">
                      <div class="flex-grow-1">
                        <p class="text-muted mb-1 fs-12">${e.time}</p>
                        <div class="px-4 py-10px bg-light-subtle text-body rounded-top-3 rounded-end-3">
                          ${e.content}
                        </div>
                      </div>
                      <div class="dropdown">
                        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" aria-expanded="true" title="dropdown-button">
                          <i class="ri-more-2-fill text-muted"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                          <li>
                            <a href="#!" class="dropdown-item">
                              <i class="ri-reply-line me-1"></i>
                              <span>Reply</span>
                            </a>
                          </li>
                          <li>
                            <a href="#!" class="dropdown-item delete-message" data-id="${r}">
                                <i class="ri-delete-bin-line me-1"></i>
                                <span>Delete</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    ${t}
                  </div>
                </div>
              `}o.innerHTML+=n});let s=document.querySelector(`.chat-height`);s.scrollTop=s.scrollHeight;let c=document.querySelector(`.chat-list-item.active .badge`);c&&(c.style.display=`none`),i=t,o.querySelectorAll(`.delete-message`).forEach(e=>{e.addEventListener(`click`,function(e){e.preventDefault();let t=this.getAttribute(`data-id`),n=parseInt(t.split(`-`)[1]);u[i]&&u[i].messages&&n>=0&&u[i].messages.splice(n,1),d(i)})})}e.forEach(e=>{e.addEventListener(`click`,function(e){e.preventDefault();let t=this.querySelector(`h6`).textContent;d(t)})}),d(i);function f(){let e=a.value.trim();if(e){let t={sender:`Me`,avatar:`assets/images/avatar/user-17.webp`,time:m(),content:e,isMe:!0};u[i].messages.push(t),d(i),p(),a.value=``}}function p(){setTimeout(()=>{t&&t.lastElementChild?t.lastElementChild.scrollIntoView({behavior:`smooth`,block:`end`}):(t=document.querySelector(`#chat-messages`),t&&t.lastElementChild&&t.lastElementChild.scrollIntoView({behavior:`smooth`,block:`end`}))},200)}if(o&&o.addEventListener(`click`,function(e){e.preventDefault(),f()}),a&&a.addEventListener(`keypress`,function(e){e.key===`Enter`&&(e.preventDefault(),f())}),s){let e=s.querySelector(`a:first-child`);e&&e.addEventListener(`click`,function(e){e.preventDefault(),u[i].messages=[],d(i)})}function m(){let e=new Date,t=e.getHours(),n=e.getMinutes().toString().padStart(2,`0`),r=t>=12?`PM`:`AM`;return`Today, ${t%12||12}:${n} ${r}`}document.getElementById(`callModal`).addEventListener(`show.bs.modal`,function(e){let t=u[i]||u[`Dawn Teague`],n=this.querySelector(`#callAvatar`),r=n.querySelector(`img`),a=this.querySelector(`.modal-body h6`),o=n.querySelector(`.initials`);if(o&&o.remove(),t.avatar&&t.avatar!==``)r.src=t.avatar,r.style.display=`block`;else{r.style.display=`none`;let e=document.createElement(`span`);e.className=`initials fw-semibold d-flex justify-content-center align-items-center size-10 rounded-circle bg-light-subtle`,e.textContent=t.initials||``,e.style.display=`flex`,n.appendChild(e)}a.textContent=i}),d=function(e){r(e),i=e};function h(e,t){if(u[e]){d(e);let t=document.getElementById(`addNewChatModals`),n=window.bootstrap.Modal.getInstance(t);return n&&n.hide(),!0}else{if(u[e]={avatar:t||``,lastSeen:`Now`,messages:[]},!t){let t=e.split(` `),n=``;n=t.length>=2?t[0].charAt(0)+t[1].charAt(0):t[0].charAt(0),u[e].initials=n}let n=document.querySelector(`#chatList`);if(!n){console.error(`Chat list element not found`);return}let r=document.createElement(`li`);r.id=`chat-list-item`,t&&(r.innerHTML=`
          <a href="#!" class="chat-list-item">
            <div class="position-relative size-10 bg-light flex-shrink-0 rounded-circle avatar">
              <img src="${t}" alt="" class="img-fluid rounded-circle">
              <span class="status-indicator bg-success rounded-circle size-2-5"></span>
            </div>
            <div class="flex-grow-1 overflow-hidden">
              <h6 class="mb-0 fw-bold">${e}</h6>
              <p class="fs-12 text-muted text-truncate">Start a conversation</p>
            </div>
            <div class="fs-11 text-body-secondary">Now</div>
            <span class="badge bg-danger rounded-circle position-absolute top-0 end-0 d-none">0</span>
          </a>
        `),r.addEventListener(`click`,function(t){t.preventDefault(),d(e)}),n.appendChild(r);let i=document.getElementById(`addNewChatModals`),a=window.bootstrap.Modal.getInstance(i);return a&&a.hide(),d(e),!0}}document.querySelectorAll(`.toggle-mic`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.querySelector(`.mic-off-icon`),n=e.querySelector(`.mic-on-icon`);t.classList.toggle(`d-none`),n.classList.toggle(`d-none`)})}),document.addEventListener(`DOMContentLoaded`,function(){let e=document.getElementById(`addNewChatModals`);e&&e.querySelectorAll(`.btn.btn-xs.btn-light`).forEach(e=>{e.addEventListener(`click`,function(e){e.preventDefault();let t=this.closest(`li`);if(!t)return;let n=t.querySelector(`h6`).textContent,r=t.querySelector(`img`);h(n,r?r.getAttribute(`src`):``)||console.error(`Failed to add new chat user`)})});let t=document.querySelector(`#addNewChatModals input[type="text"]`);t&&t.addEventListener(`input`,function(){let e=this.value.toLowerCase();document.querySelectorAll(`#addNewChatModals li`).forEach(t=>{t.querySelector(`h6`).textContent.toLowerCase().includes(e)?t.style.display=``:t.style.display=`none`})})}),c.addEventListener(`input`,function(){let e=this.value.toLowerCase(),t=document.getElementById(`noResult`),n=!1;l.forEach(t=>{let r=t.querySelector(`h6`).textContent.toLowerCase(),i=t.querySelector(`p`).textContent.toLowerCase();r.includes(e)||i.includes(e)?(t.closest(`li`).style.display=``,n=!0):t.closest(`li`).style.display=`none`}),!n&&e!==``?t.classList.remove(`d-none`):t.classList.add(`d-none`)});let g=document.querySelector(`#addNewChatModals input[type="text"]`);g&&g.addEventListener(`input`,function(){let e=this.value.toLowerCase(),t=document.querySelectorAll(`#addNewChatModals li`),n=!1;t.forEach(t=>{t.querySelector(`h6`).textContent.toLowerCase().includes(e)?(t.style.display=``,n=!0):t.style.display=`none`});let r=document.querySelector(`#addNewChatModals .no-result`);r&&(!n&&e!==``?r.classList.remove(`d-none`):r.classList.add(`d-none`))}),d(i),window.onload=function(){p()}}