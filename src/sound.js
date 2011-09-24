var themeSound;
var moveSound;
var shootSound;
var hitSound;
var killSound;

function initSound() {

  soundManager.url = 'lib/SoundManager/swf/';
  soundManager.useHTML5Audio = true;
  soundManager.preferFlash = false;
  soundManager.debugMode = false;

  soundManager.onready(function(){

  // SM2 has loaded - now you can create and play sounds!
  themeSound = soundManager.createSound({
	  id: 'themeSound',
	  url: 'sounds/theme.mp3'
  });

  shootSound = soundManager.createSound({
	  id: 'shootSound',
	  url: 'sounds/shoot.mp3'
  });
	
  moveSound = soundManager.createSound({
	  id: 'moveSound',
	  url: 'sounds/shoot.mp3'
  });

  hitSound = soundManager.createSound({
	  id: 'hitSound',
	  url: 'sounds/kill.mp3'
  });

  killSound = soundManager.createSound({
	  id: 'killSound',
	  url: 'sounds/kill.mp3'
  });



});
}

function loopSound(sound) {
  sound.play({
    onfinish: function() {
      loopSound(sound);
    }
  });
  console.log('SoundStart');
}

function startSound() {
  loopSound(themeSound);	
}

function playShootSound() {
  shootSound.play();
}

function playHitSound() {
  hitSound.play();
}

function playKillSound() {
  killSound.play();
}