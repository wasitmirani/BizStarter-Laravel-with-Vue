(function () {
    "use strict";

    var myElement1 = document.getElementById('chat-msg-scroll');
    new SimpleBar(myElement1, { autoHide: true });

    var myElement2 = document.getElementById('groups-tab-pane-list');
    new SimpleBar(myElement2, { autoHide: true });

    var myElement3 = document.getElementById('contacts-tab-pane-list');
    new SimpleBar(myElement3, { autoHide: true });

    var myElement4 = document.getElementById('main-chat-content');
    new SimpleBar(myElement4, { autoHide: true });

    var myElement5 = document.getElementById('chat-robot-tab');
    new SimpleBar(myElement5, { autoHide: true });

    var myElement6 = document.getElementById('recent-doc-tab');
    new SimpleBar(myElement6, { autoHide: true });

    var myElement7 = document.getElementById('main-chat-content1');
    new SimpleBar(myElement7, { autoHide: true });

    var myElement8 = document.getElementById('chat-status-tab');
    new SimpleBar(myElement8, { autoHide: true });

    var myElement9 = document.getElementById('call-tab-list');
    new SimpleBar(myElement9, { autoHide: true });

    var myElement10 = document.getElementById('main-chat-navabar');
    new SimpleBar(myElement10, { autoHide: true });

    var myElement11 = document.getElementById('profile-tab-list');
    new SimpleBar(myElement11, { autoHide: true });

    document.querySelector(".responsive-chat-close").addEventListener("click", () => {
        document.querySelector(".main-chart-wrapper").classList.remove("responsive-chat-open")
    })

    var lightboxVideo = GLightbox({
        selector: '.glightbox'
    });
    lightboxVideo.on('slide_changed', ({ prev, current }) => {
        console.log('Prev slide', prev);
        console.log('Current slide', current);

        const { slideIndex, slideNode, slideConfig, player } = current;
    });

    /* Image upload */
let loadFile = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById("profile-img");
      if (event.target.files[0].type.match("image.*")) {
        output.src = reader.result;
      } else {
        event.target.value = "";
        alert("please select a valid image");
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  
  // for profile photo update
  let ProfileChange = document.querySelector("#profile-change");
  ProfileChange.addEventListener("change", loadFile);

})();

let loadFile = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('profile-img');
        if (event.target.files[0].type.match('image.*')) {
            output.src = reader.result;
        } else {
            event.target.value = '';
            alert('please select a valid image');
        }
    };
    if(event.target.files[0]){
        reader.readAsDataURL(event.target.files[0]);
    }
};

let changeTheInfo = (element, name, img, status) => {
    document.querySelectorAll(".checkforactive").forEach((ele) => {
        ele.classList.remove("active")
    })
    element.closest("li").classList.add("active")
    document.querySelectorAll(".chatnameperson").forEach((ele) => {
        ele.innerText = name
    })
    let image = `../assets/images/faces/${img}.jpg`
    document.querySelectorAll(".chatimageperson").forEach((ele) => {
        ele.src = image
    })

    document.querySelectorAll(".chatstatusperson").forEach((ele) => {
        ele.classList.remove("online")
        ele.classList.remove("offline")
        ele.classList.add(status)
    })



    document.querySelector(".chatpersonstatus").innerText = status

    document.querySelector(".main-chart-wrapper").classList.add("responsive-chat-open")
}

new FgEmojiPicker({
    trigger: [".emoji-picker"],
    insertInto: document.querySelector(".chat-message-space"),
    closeButton: true,
    position: ['top', 'right'],
    preFetch: true,
    dir:"../assets/libs/fg-emoji-picker/"
});

document.addEventListener("DOMContentLoaded", function () {
    const tabPane = document.getElementById("robot-tab");
    const chatSection = document.querySelector(".robot-chat");
    const mainChat = document.querySelector(".main-chat")

    chatSection.style.display = "none";
    mainChat.style.display= "block";

    tabPane.addEventListener("click", function () {
        chatSection.style.display = "block";
        mainChat.style.display= "none";
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.chat-nav-link');
    const mainChat = document.querySelector(".main-chat"); 
    const robotChat = document.querySelector(".robot-chat"); 

    function handleTabClick(event) {
        tabs.forEach(tab => tab.classList.remove('active'));
        mainChat.style.display = 'none';
        robotChat.style.display = 'none';

        event.currentTarget.classList.add('active');

        if (event.currentTarget.id === 'robot-tab') {
            robotChat.style.display = 'block';
        } else {
            mainChat.style.display = 'block';
        }
    }
    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
    mainChat.style.display = 'block';
});

