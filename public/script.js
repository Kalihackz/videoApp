const socket= io('/')
const videoGrid = document.getElementById("video-grid")
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}

var peer = new Peer(undefined,{
    path: '/peerjs',
    host:'/',
    port:'3030'
}); 

let myvideoStream;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myvideoStream = stream;
    addVideoStream(myVideo,stream);

    peer.on('call',call=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);

        })
    })

    socket.on('user-connected',(userId)=>{
    connectToNewUser(userId,stream);
     })

     let text = $('input')

$('html').keydown(function(e){
    if(e.which==13 && text.val().length !==0){
        socket.emit('message',{textv:text.val(),personv:person});
        text.val('')

    }
});

socket.on('createMessage',message => {
    
    $('.messages').append(`<li class="message"><b>${message.personv}</b><br>${message.textv}</li>`)
    scrollToBottom()
})
})

 socket.on('user-disconnected', userId => {
     if (peers[userId]) peers[userId].close()
   })

socket.on('total',totalv =>{
    document.getElementById("VIP").innerHTML =totalv;
})


peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})


const connectToNewUser =(userId,stream)=>{
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close', () => {
    video.remove()
    })
    
    peers[userId] = call

}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();

    })
    videoGrid.append(video);
}

const scrollToBottom=()=>{
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));


}

const muteUnmute=()=>{
    const enabled = myvideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myvideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myvideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton=()=>{
    const html=`<i class="fas fa-microphone"></i>
    <span>Mute</span>`;
    document.querySelector('.main__mute_button').innerHTML = html;

}

const setUnmuteButton=()=>{
    const html=`<i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`;
    document.querySelector('.main__mute_button').innerHTML = html;

}

const playStop=()=>{
    let enabled = myvideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myvideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myvideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo=()=>{
    const html=`<i class="fas fa-video"></i>
    <span>Stop Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html;

}

const setPlayVideo=()=>{
    const html=`<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html;

}

