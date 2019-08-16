var SavageLoader = function(parentContainer, settings) {
    var self = this;

    if (null == settings) {
        settings = {};
    }
    self.parentContainer = parentContainer;
    self.settings = settings;
    self.loaderType = settings.loaderType || "round";
    self.currentImage = 1;
    self.imageUrl = settings.imageUrl || "images/randysavage-small.png";
    self.moveToNextDelay = settings.moveToNextDelay || 150;
    self.fadeDelay = settings.fadeDelay || 700;
    self.fadeType = settings.fadeType || "fade";
    self.imageCount = settings.imageCount || 10;
    self.direction = 'right';
    self.turnDelay = settings.turnDelay || 50;

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

                //self.currentImage++;
                //if (self.currentImage > self.imageCount) {
                //    self.currentImage = 1;
                //}


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

    };
    self.animate();

    self.create = function() {
        if (self.loaderType === 'round') {
            $(self.parentContainer).prepend($('<div>', {
                class: 'savage-around-container'
            }));
            for (var i = 1; i < 9; i++) {
                $(self.parentContainer).children('.savage-around-container').prepend($('<img/>', {
                    class: 'roundloader-image roundloader-image-' + i,
                    src: self.imageUrl,
                    alt: 'image for animation'
                }));
            }
        }
        if (self.loaderType === 'horizontal') {
            var imagesCreatedCount = 0;
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
    };
    self.create();
};

$.fn.progressBar = function(settings) {

    settings.element = $(this);
    var newProgressBar = new ProgressBar(settings)
    return newProgressBar;

};