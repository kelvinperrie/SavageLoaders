var SavageLoader = function(parentContainer, settings) {
    var self = this;

    // use any settings passed in, otherwise setup some defaults
    if (null == settings) {
        settings = {};
    }
    self.parentContainer = parentContainer;
    self.settings = settings;
    self.loaderType = settings.loaderType || "round";                       // round, horizontal, rotate, rotateX, rotateY, pulse
    self.currentImage = 1;                                                  // used when multiple images to track which one we're animating next
    self.imageUrl = settings.imageUrl || "images/randysavage-small.png";    
    if(self.loaderType === 'rotate') {                                      // moveToNextDelay specifies the delay we use before moving to next image or repeating the animation
        self.moveToNextDelay = settings.moveToNextDelay || 50;  // give the rotate loader less of a delay
    } else {
        self.moveToNextDelay = settings.moveToNextDelay || 150;
    }
    self.fadeDelay = settings.fadeDelay || 700;                             // the delay applied to a specific image
    self.fadeType = settings.fadeType || "fade";                            // the type of fade for round loaders
    self.imageCount = settings.imageCount || 10;                            // how many images for horizontal loaders
    self.direction = 'right';                                               // the current direction the horizontal loader is moving in
    self.turnDelay = settings.turnDelay || 50;                              // the delay before changing direction on the horizontal loader
    self.currentAngle = settings.startAngle || 0;                           // the starting angle for rotate loaders
    self.angleIncrement = settings.angleIncrement || 5;                     // how much angle changes at each step for the rotate loaders
    self.currentOpacity = 1;                                                // tracks the opacity for the pulse loader
    self.opacityIncrement = -0.1;                                           // how much to change the opacity at each step for the pulse loader
    // kitchen sink

    // does the animation required by the specific loader
    self.animate = function() {
        if (self.loaderType === 'round') {
            var imageSelector = '.roundloader-image-' + self.currentImage;
            if (self.fadeType === 'hide') {
                $(self.parentContainer).find(imageSelector).show().hide(self.fadeDelay);
            } else {
                $(self.parentContainer).find(imageSelector).show().fadeOut(self.fadeDelay);
            }
            self.currentImage++;
            if (self.currentImage > 8) {
                self.currentImage = 1;
            }
            setTimeout(function() {
                self.animate();
            }, self.moveToNextDelay);
        }
        if (self.loaderType === 'horizontal') {
            var imageSelector = '.horizontalloader-image-' + self.currentImage;
            var delay = 0;
            $(self.parentContainer).find(imageSelector).css({
                opacity: 1
            }).stop().animate({
                opacity: 0
            }, self.fadeDelay);

            if (self.direction === 'right') {
                self.currentImage++;
                if (self.currentImage > self.imageCount) {
                    delay = self.turnDelay;
                    self.currentImage = self.imageCount;
                    self.direction = 'left';
                }
            }
            if (self.direction === 'left') {
                self.currentImage--;
                if (self.currentImage < 1) {
                    delay = self.turnDelay;
                    self.currentImage = 2;
                    self.direction = 'right';
                }
            }

            setTimeout(function() {
                self.animate();
            }, self.moveToNextDelay + delay);
        }
        if (self.loaderType === 'rotate') {
            var imageSelector = '.rotateloader-image-1';
            $(self.parentContainer).find(imageSelector).show().css( "transform", "rotate(" + self.currentAngle + "deg)" );
            self.currentAngle += self.angleIncrement;

            setTimeout(function() {
                self.animate();
            }, self.moveToNextDelay);
        }
        if (self.loaderType === 'rotateX') {
            var imageSelector = '.rotateXloader-image-1';
            $(self.parentContainer).find(imageSelector).show().css( "transform", "rotateX(" + self.currentAngle + "deg)" );
            self.currentAngle += self.angleIncrement;

            setTimeout(function() {
                self.animate();
            }, self.moveToNextDelay);
        }
        if (self.loaderType === 'rotateY') {
            var imageSelector = '.rotateYloader-image-1';
            $(self.parentContainer).find(imageSelector).show().css( "transform", "rotateY(" + self.currentAngle + "deg)" );
            self.currentAngle += self.angleIncrement;

            setTimeout(function() {
                self.animate();
            }, self.moveToNextDelay);
        }
        if (self.loaderType === 'pulse') {
            var imageSelector = '.pulseloader-image-1';
            self.currentOpacity +=self.opacityIncrement;
            if(self.currentOpacity > 1 || self.currentOpacity < 0) {
                self.opacityIncrement = self.opacityIncrement * -1;
                self.currentOpacity = self.currentOpacity + (self.opacityIncrement * 2);
            }
            // and here we reinvent the animation wheel, thanks for coming
            $(self.parentContainer).find(imageSelector).css({
                "opacity": self.currentOpacity
            });

            setTimeout(function() {
                self.animate();
            }, self.moveToNextDelay);
        }

    };
    self.animate();

    // generates html required by the specified loader
    self.create = function() {
        if (self.loaderType === 'round') {
            $(self.parentContainer).prepend($('<div>', {
                class: 'savage-around-container'
            }));
            for (var i = 1; i < 9; i++) {
                $(self.parentContainer).children('.savage-around-container').prepend($('<img/>', {
                    class: 'roundloader-image-' + i,
                    src: self.imageUrl,
                    alt: 'image for animation'
                }));
            }
        }
        if (self.loaderType === 'horizontal') {
            $(self.parentContainer).prepend($('<div>', {
                class: 'savage-horizontal-container'
            }));
            for (var i = self.imageCount; i > 0; i--) {
                $(self.parentContainer).children('.savage-horizontal-container').prepend($('<img/>', {
                    class: 'horizontalloader-image-' + i,
                    src: self.imageUrl,
                    alt: 'image for animation'
                }));
            }
        }
        if (self.loaderType === 'rotate' || self.loaderType === 'pulse' || self.loaderType === 'rotateX' || self.loaderType === 'rotateY') {
            $(self.parentContainer).prepend($('<div>', {
                class: 'savage-'+self.loaderType+'-container'
            }));
            $(self.parentContainer).children('.savage-'+self.loaderType+'-container').prepend($('<img/>', {
                class: self.loaderType+'loader-image-1',
                src: self.imageUrl,
                alt: 'image for animation'
            }));
        }
    };
    self.create();
};

// wrapper to create as jquery function
$.fn.savageLoader = function(settings) {

    var newSavageLoader = new SavageLoader($(this),settings)
    return newSavageLoader;

};