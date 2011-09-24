function initSound() {

soundManager.url = 'lib/SoundManager/swf/';
soundManager.useHTML5Audio = true;
soundManager.preferFlash = false;
soundManager.debugMode = false;

soundManager.onready(function(){

  // SM2 has loaded - now you can create and play sounds!

});
}

function startSound() {
  var themeSound = soundManager.createSound({
	  id: 'aSound',
	  url: 'lib/SoundManager/theme.mp3'
	  // onload: myOnloadHandler,
	  // other options here..
  });

  loopSound(themeSound);	
}

function loopSound(sound) {
  sound.play({
    onfinish: function() {
      loopSound(sound);
    }
  });
}