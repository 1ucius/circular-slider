( function() {
    'use strict';

    function startSetup( sliderSize, slideSize, animationDuration, autoplayInterval ) {
        
        this.sliderSize        = parseFloat( sliderSize )/100;
        this.slideSize         = parseFloat( slideSize )/100;
        this.animationDuration = parseFloat( animationDuration );
        this.autoplayInterval  = parseFloat( autoplayInterval );
        
    };

    function Slider( newSlider, sliderSize, slideSize, animationDuration, autoplayInterval ) {

        this.startSetup           = new startSetup( sliderSize, slideSize, animationDuration, autoplayInterval ),

        this.wrapper              = newSlider.querySelector( '.wrapper' );

        this.slides               = newSlider.querySelectorAll( '.circular-slider .wrapper .slides-holder .slides-holder__item' );

        this.descriptionsHolder   = newSlider.querySelector( '.circular-slider .wrapper .descriptions' );

        this.descriptions         = newSlider.querySelectorAll( '.circular-slider .wrapper .descriptions .descriptions__item' );

        this.slidesHolder         = newSlider.querySelector( '.circular-slider .wrapper .slides-holder' );

        this.btnLeft              = newSlider.querySelector( '.circular-slider .wrapper .controls .controls__left' );

        this.btnRight             = newSlider.querySelector( '.circular-slider .wrapper .controls .controls__right' );

        this.btnAutoplay          = newSlider.querySelector( '.circular-slider .wrapper .controls .controls__autoplay' );

        this.currentAngle         = 0;

        this.stepAngle            = 2*Math.PI/newSlider.querySelectorAll( '.circular-slider .wrapper .slides-holder .slides-holder__item' ).length;

        this.currentSlide         = 0;

        this.slidesHolder.style.transitionDuration = this.startSetup.animationDuration + 'ms';
        this.onResize();
        this.setAutoplay();
        this.setNav();

        let _this = this;
        this.btnAutoplay.onclick = function() {

            if( this.classList.contains( 'controls__autoplay_running' ) ) {
        
                this.classList.remove( 'controls__autoplay_running' );
                this.classList.add( 'controls__autoplay_paused' );
                clearInterval( _this.autoplay );
                _this.autoplay = null;
        
            } else {
        
                this.classList.remove( 'controls__autoplay_paused' );
                this.classList.add( 'controls__autoplay_running' );
                _this.setAutoplay(); 
    
            }
    
        }

    };

    Slider.prototype.onResize = function() {
        
        let radius,
            w = this.wrapper.parentNode.getBoundingClientRect().width,
            h = this.wrapper.parentNode.getBoundingClientRect().height;

        2*h <= w ? radius = h*this.startSetup.sliderSize
                 : radius = ( w/2 )*this.startSetup.sliderSize;

        this.setSize( radius );

    };

    Slider.prototype.setSize = function( radius ) {

        this.wrapper.style.width             = 2*radius + 'px';
        this.wrapper.style.height            = radius + 'px';
        this.slidesHolder.style.width        = this.slidesHolder.style.height = 2*radius*( 1 - this.startSetup.slideSize ) + 'px';
        this.slidesHolder.style.marginTop    = radius*this.startSetup.slideSize + 'px';
        this.descriptionsHolder.style.width  = 2*radius*( 1 - this.startSetup.slideSize - 0.2 ) + 'px';
        this.descriptionsHolder.style.height = radius*( 1 - this.startSetup.slideSize ) + 'px';
        this.slidesRepositioning();

        let s = Math.min( 2*radius*this.startSetup.slideSize, this.stepAngle*radius*( 1 - this.startSetup.slideSize ) - 50 );

        for( let i = 0; i < this.slides.length; i++ ) {
            this.slides[i].style.width = this.slides[i].style.height = s + 'px';
        };

    };

    Slider.prototype.slidesRepositioning = function() {

        let r = this.slidesHolder.getBoundingClientRect().width/2;

        for( let i = 0; i < this.slides.length; i++ ) {

            let x = r*Math.cos( this.stepAngle*i - Math.PI/2 ),
                y = r*Math.sin( this.stepAngle*i - Math.PI/2 );
            this.slides[i].style.transform = 'translate( ' + x  + 'px, ' + y + 'px ) rotate( ' + this.stepAngle*180/Math.PI*i + 'deg )';
            
        };

    };

    Slider.prototype.rotate = function( multiplier ) {

        let _this = this;

        this.disableNav();
        setTimeout( function(){ _this.setNav() }, this.startSetup.animationDuration + 20 );
        if ( this.autoplay != null ) {
            clearInterval( this.autoplay );
            this.setAutoplay(); 
        }
        this.descriptions[this.currentSlide].classList.remove( 'descriptions__item_visible' );

        if( this.currentSlide === this.slides.length - 1  && multiplier === -1 ) {

            this.slidesHolder.style.transform = 'rotate( -360deg )';
            this.currentSlide                 = 0;
            this.currentAngle                 = 0;
            this.descriptions[this.currentSlide].classList.add( 'descriptions__item_visible' );

            setTimeout( function(){

                _this.slidesHolder.style.transitionDuration = 0 + 's';
                _this.slidesHolder.style.transform          = 'rotate( ' + _this.currentAngle + 'deg )';
                setTimeout( function() { _this.slidesHolder.style.transitionDuration = _this.startSetup.animationDuration + 'ms'; }, 20 );
                
            }, this.startSetup.animationDuration );

        } else if ( this.currentSlide === 0 && multiplier === 1 ) {

            this.slidesHolder.style.transform = 'rotate( ' + this.stepAngle*180/Math.PI + 'deg )';
            this.currentSlide                 = _this.slides.length - 1;
            this.currentAngle                 = -( 2*Math.PI - _this.stepAngle )*180/Math.PI;
            this.descriptions[this.currentSlide].classList.add( 'descriptions__item_visible' );

            setTimeout( function(){

                _this.slidesHolder.style.transitionDuration = 0 + 's';
                _this.slidesHolder.style.transform = 'rotate( ' + _this.currentAngle + 'deg )';
                setTimeout( function() { _this.slidesHolder.style.transitionDuration = _this.startSetup.animationDuration + 'ms'; }, 20 );

            }, this.startSetup.animationDuration );

        } else {

            this.currentSlide                -= multiplier;
            this.currentAngle                += ( this.stepAngle*180/Math.PI )*multiplier;
            this.slidesHolder.style.transform = 'rotate( ' + this.currentAngle + 'deg )';
            this.descriptions[this.currentSlide].classList.add( 'descriptions__item_visible' );

        }

    };

    Slider.prototype.setNav = function() {

        let _this              = this;
        _this.btnLeft.onclick  = function() { _this.rotate(1) };
        _this.btnRight.onclick = function() { _this.rotate(-1) };

    };

    Slider.prototype.disableNav = function() {

        this.btnLeft.onclick  = null;
        this.btnRight.onclick = null;

    };

    Slider.prototype.setAutoplay = function() { 
        let _this     = this;
        this.autoplay = setInterval( function() { _this.rotate(-1) }, _this.startSetup.autoplayInterval + 20 ); 
    };

    ///////////Настройка слайдеров/////////// 
    window.circularSlider1 = new Slider( document.querySelector( '.circular-slider-1' ), 100, 20, 600, 2000 );
    window.circularSlider2 = new Slider( document.querySelector( '.circular-slider-2' ), 90, 20, 1000, 3000 );
    window.circularSlider3 = new Slider( document.querySelector( '.circular-slider-3' ), 80, 20, 800, 4000 );
    window.circularSlider4 = new Slider( document.querySelector( '.circular-slider-4' ), 70, 20, 400, 5000 );
 
    window.onresize = function() {
        window.circularSlider1.onResize();
        window.circularSlider2.onResize();
        window.circularSlider3.onResize();
        window.circularSlider4.onResize();
    }
    //////////////////////

} )();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiggZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgZnVuY3Rpb24gc3RhcnRTZXR1cCggc2xpZGVyU2l6ZSwgc2xpZGVTaXplLCBhbmltYXRpb25EdXJhdGlvbiwgYXV0b3BsYXlJbnRlcnZhbCApIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNsaWRlclNpemUgICAgICAgID0gcGFyc2VGbG9hdCggc2xpZGVyU2l6ZSApLzEwMDtcclxuICAgICAgICB0aGlzLnNsaWRlU2l6ZSAgICAgICAgID0gcGFyc2VGbG9hdCggc2xpZGVTaXplICkvMTAwO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRHVyYXRpb24gPSBwYXJzZUZsb2F0KCBhbmltYXRpb25EdXJhdGlvbiApO1xyXG4gICAgICAgIHRoaXMuYXV0b3BsYXlJbnRlcnZhbCAgPSBwYXJzZUZsb2F0KCBhdXRvcGxheUludGVydmFsICk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIFNsaWRlciggbmV3U2xpZGVyLCBzbGlkZXJTaXplLCBzbGlkZVNpemUsIGFuaW1hdGlvbkR1cmF0aW9uLCBhdXRvcGxheUludGVydmFsICkge1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0U2V0dXAgICAgICAgICAgID0gbmV3IHN0YXJ0U2V0dXAoIHNsaWRlclNpemUsIHNsaWRlU2l6ZSwgYW5pbWF0aW9uRHVyYXRpb24sIGF1dG9wbGF5SW50ZXJ2YWwgKSxcclxuXHJcbiAgICAgICAgdGhpcy53cmFwcGVyICAgICAgICAgICAgICA9IG5ld1NsaWRlci5xdWVyeVNlbGVjdG9yKCAnLndyYXBwZXInICk7XHJcblxyXG4gICAgICAgIHRoaXMuc2xpZGVzICAgICAgICAgICAgICAgPSBuZXdTbGlkZXIucXVlcnlTZWxlY3RvckFsbCggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLnNsaWRlcy1ob2xkZXIgLnNsaWRlcy1ob2xkZXJfX2l0ZW0nICk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25zSG9sZGVyICAgPSBuZXdTbGlkZXIucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLmRlc2NyaXB0aW9ucycgKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnMgICAgICAgICA9IG5ld1NsaWRlci5xdWVyeVNlbGVjdG9yQWxsKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuZGVzY3JpcHRpb25zIC5kZXNjcmlwdGlvbnNfX2l0ZW0nICk7XHJcblxyXG4gICAgICAgIHRoaXMuc2xpZGVzSG9sZGVyICAgICAgICAgPSBuZXdTbGlkZXIucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLnNsaWRlcy1ob2xkZXInICk7XHJcblxyXG4gICAgICAgIHRoaXMuYnRuTGVmdCAgICAgICAgICAgICAgPSBuZXdTbGlkZXIucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLmNvbnRyb2xzIC5jb250cm9sc19fbGVmdCcgKTtcclxuXHJcbiAgICAgICAgdGhpcy5idG5SaWdodCAgICAgICAgICAgICA9IG5ld1NsaWRlci5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuY29udHJvbHMgLmNvbnRyb2xzX19yaWdodCcgKTtcclxuXHJcbiAgICAgICAgdGhpcy5idG5BdXRvcGxheSAgICAgICAgICA9IG5ld1NsaWRlci5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuY29udHJvbHMgLmNvbnRyb2xzX19hdXRvcGxheScgKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50QW5nbGUgICAgICAgICA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcEFuZ2xlICAgICAgICAgICAgPSAyKk1hdGguUEkvbmV3U2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5zbGlkZXMtaG9sZGVyIC5zbGlkZXMtaG9sZGVyX19pdGVtJyApLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2xpZGUgICAgICAgICA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArICdtcyc7XHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0QXV0b3BsYXkoKTtcclxuICAgICAgICB0aGlzLnNldE5hdigpO1xyXG5cclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYnRuQXV0b3BsYXkub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYoIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCAnY29udHJvbHNfX2F1dG9wbGF5X3J1bm5pbmcnICkgKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoICdjb250cm9sc19fYXV0b3BsYXlfcnVubmluZycgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCggJ2NvbnRyb2xzX19hdXRvcGxheV9wYXVzZWQnICk7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKCBfdGhpcy5hdXRvcGxheSApO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYXV0b3BsYXkgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCAnY29udHJvbHNfX2F1dG9wbGF5X3BhdXNlZCcgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCggJ2NvbnRyb2xzX19hdXRvcGxheV9ydW5uaW5nJyApO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QXV0b3BsYXkoKTsgXHJcbiAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5vblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCByYWRpdXMsXHJcbiAgICAgICAgICAgIHcgPSB0aGlzLndyYXBwZXIucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcclxuICAgICAgICAgICAgaCA9IHRoaXMud3JhcHBlci5wYXJlbnROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuXHJcbiAgICAgICAgMipoIDw9IHcgPyByYWRpdXMgPSBoKnRoaXMuc3RhcnRTZXR1cC5zbGlkZXJTaXplXHJcbiAgICAgICAgICAgICAgICAgOiByYWRpdXMgPSAoIHcvMiApKnRoaXMuc3RhcnRTZXR1cC5zbGlkZXJTaXplO1xyXG5cclxuICAgICAgICB0aGlzLnNldFNpemUoIHJhZGl1cyApO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24oIHJhZGl1cyApIHtcclxuXHJcbiAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLndpZHRoICAgICAgICAgICAgID0gMipyYWRpdXMgKyAncHgnO1xyXG4gICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5oZWlnaHQgICAgICAgICAgICA9IHJhZGl1cyArICdweCc7XHJcbiAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUud2lkdGggICAgICAgID0gdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUuaGVpZ2h0ID0gMipyYWRpdXMqKCAxIC0gdGhpcy5zdGFydFNldHVwLnNsaWRlU2l6ZSApICsgJ3B4JztcclxuICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS5tYXJnaW5Ub3AgICAgPSByYWRpdXMqdGhpcy5zdGFydFNldHVwLnNsaWRlU2l6ZSArICdweCc7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnNIb2xkZXIuc3R5bGUud2lkdGggID0gMipyYWRpdXMqKCAxIC0gdGhpcy5zdGFydFNldHVwLnNsaWRlU2l6ZSAtIDAuMiApICsgJ3B4JztcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uc0hvbGRlci5zdHlsZS5oZWlnaHQgPSByYWRpdXMqKCAxIC0gdGhpcy5zdGFydFNldHVwLnNsaWRlU2l6ZSApICsgJ3B4JztcclxuICAgICAgICB0aGlzLnNsaWRlc1JlcG9zaXRpb25pbmcoKTtcclxuXHJcbiAgICAgICAgbGV0IHMgPSBNYXRoLm1pbiggMipyYWRpdXMqdGhpcy5zdGFydFNldHVwLnNsaWRlU2l6ZSwgdGhpcy5zdGVwQW5nbGUqcmFkaXVzKiggMSAtIHRoaXMuc3RhcnRTZXR1cC5zbGlkZVNpemUgKSAtIDUwICk7XHJcblxyXG4gICAgICAgIGZvciggbGV0IGkgPSAwOyBpIDwgdGhpcy5zbGlkZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzW2ldLnN0eWxlLndpZHRoID0gdGhpcy5zbGlkZXNbaV0uc3R5bGUuaGVpZ2h0ID0gcyArICdweCc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWRlci5wcm90b3R5cGUuc2xpZGVzUmVwb3NpdGlvbmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgciA9IHRoaXMuc2xpZGVzSG9sZGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLzI7XHJcblxyXG4gICAgICAgIGZvciggbGV0IGkgPSAwOyBpIDwgdGhpcy5zbGlkZXMubGVuZ3RoOyBpKysgKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgeCA9IHIqTWF0aC5jb3MoIHRoaXMuc3RlcEFuZ2xlKmkgLSBNYXRoLlBJLzIgKSxcclxuICAgICAgICAgICAgICAgIHkgPSByKk1hdGguc2luKCB0aGlzLnN0ZXBBbmdsZSppIC0gTWF0aC5QSS8yICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzW2ldLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoICcgKyB4ICArICdweCwgJyArIHkgKyAncHggKSByb3RhdGUoICcgKyB0aGlzLnN0ZXBBbmdsZSoxODAvTWF0aC5QSSppICsgJ2RlZyApJztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWRlci5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24oIG11bHRpcGxpZXIgKSB7XHJcblxyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzYWJsZU5hdigpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7IF90aGlzLnNldE5hdigpIH0sIHRoaXMuc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArIDIwICk7XHJcbiAgICAgICAgaWYgKCB0aGlzLmF1dG9wbGF5ICE9IG51bGwgKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoIHRoaXMuYXV0b3BsYXkgKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRBdXRvcGxheSgpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTGlzdC5yZW1vdmUoICdkZXNjcmlwdGlvbnNfX2l0ZW1fdmlzaWJsZScgKTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuY3VycmVudFNsaWRlID09PSB0aGlzLnNsaWRlcy5sZW5ndGggLSAxICAmJiBtdWx0aXBsaWVyID09PSAtMSApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoIC0zNjBkZWcgKSc7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNsaWRlICAgICAgICAgICAgICAgICA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuZ2xlICAgICAgICAgICAgICAgICA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25zW3RoaXMuY3VycmVudFNsaWRlXS5jbGFzc0xpc3QuYWRkKCAnZGVzY3JpcHRpb25zX19pdGVtX3Zpc2libGUnICk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgIF90aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAwICsgJ3MnO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zZm9ybSAgICAgICAgICA9ICdyb3RhdGUoICcgKyBfdGhpcy5jdXJyZW50QW5nbGUgKyAnZGVnICknO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7IF90aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBfdGhpcy5zdGFydFNldHVwLmFuaW1hdGlvbkR1cmF0aW9uICsgJ21zJzsgfSwgMjAgKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LCB0aGlzLnN0YXJ0U2V0dXAuYW5pbWF0aW9uRHVyYXRpb24gKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5jdXJyZW50U2xpZGUgPT09IDAgJiYgbXVsdGlwbGllciA9PT0gMSApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoICcgKyB0aGlzLnN0ZXBBbmdsZSoxODAvTWF0aC5QSSArICdkZWcgKSc7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNsaWRlICAgICAgICAgICAgICAgICA9IF90aGlzLnNsaWRlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmdsZSAgICAgICAgICAgICAgICAgPSAtKCAyKk1hdGguUEkgLSBfdGhpcy5zdGVwQW5nbGUgKSoxODAvTWF0aC5QSTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTGlzdC5hZGQoICdkZXNjcmlwdGlvbnNfX2l0ZW1fdmlzaWJsZScgKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IDAgKyAncyc7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSggJyArIF90aGlzLmN1cnJlbnRBbmdsZSArICdkZWcgKSc7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHsgX3RoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IF90aGlzLnN0YXJ0U2V0dXAuYW5pbWF0aW9uRHVyYXRpb24gKyAnbXMnOyB9LCAyMCApO1xyXG5cclxuICAgICAgICAgICAgfSwgdGhpcy5zdGFydFNldHVwLmFuaW1hdGlvbkR1cmF0aW9uICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTbGlkZSAgICAgICAgICAgICAgICAtPSBtdWx0aXBsaWVyO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmdsZSAgICAgICAgICAgICAgICArPSAoIHRoaXMuc3RlcEFuZ2xlKjE4MC9NYXRoLlBJICkqbXVsdGlwbGllcjtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSggJyArIHRoaXMuY3VycmVudEFuZ2xlICsgJ2RlZyApJztcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnNbdGhpcy5jdXJyZW50U2xpZGVdLmNsYXNzTGlzdC5hZGQoICdkZXNjcmlwdGlvbnNfX2l0ZW1fdmlzaWJsZScgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5zZXROYXYgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgbGV0IF90aGlzICAgICAgICAgICAgICA9IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuYnRuTGVmdC5vbmNsaWNrICA9IGZ1bmN0aW9uKCkgeyBfdGhpcy5yb3RhdGUoMSkgfTtcclxuICAgICAgICBfdGhpcy5idG5SaWdodC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7IF90aGlzLnJvdGF0ZSgtMSkgfTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWRlci5wcm90b3R5cGUuZGlzYWJsZU5hdiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB0aGlzLmJ0bkxlZnQub25jbGljayAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYnRuUmlnaHQub25jbGljayA9IG51bGw7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGlkZXIucHJvdG90eXBlLnNldEF1dG9wbGF5ID0gZnVuY3Rpb24oKSB7IFxyXG4gICAgICAgIGxldCBfdGhpcyAgICAgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYXV0b3BsYXkgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKSB7IF90aGlzLnJvdGF0ZSgtMSkgfSwgX3RoaXMuc3RhcnRTZXR1cC5hdXRvcGxheUludGVydmFsICsgMjAgKTsgXHJcbiAgICB9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8v0J3QsNGB0YLRgNC+0LnQutCwINGB0LvQsNC50LTQtdGA0L7Qsi8vLy8vLy8vLy8vIFxyXG4gICAgd2luZG93LmNpcmN1bGFyU2xpZGVyMSA9IG5ldyBTbGlkZXIoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyLTEnICksIDEwMCwgMjAsIDYwMCwgMjAwMCApO1xyXG4gICAgd2luZG93LmNpcmN1bGFyU2xpZGVyMiA9IG5ldyBTbGlkZXIoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyLTInICksIDkwLCAyMCwgMTAwMCwgMzAwMCApO1xyXG4gICAgd2luZG93LmNpcmN1bGFyU2xpZGVyMyA9IG5ldyBTbGlkZXIoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyLTMnICksIDgwLCAyMCwgODAwLCA0MDAwICk7XHJcbiAgICB3aW5kb3cuY2lyY3VsYXJTbGlkZXI0ID0gbmV3IFNsaWRlciggZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXItNCcgKSwgNzAsIDIwLCA0MDAsIDUwMDAgKTtcclxuIFxyXG4gICAgd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgd2luZG93LmNpcmN1bGFyU2xpZGVyMS5vblJlc2l6ZSgpO1xyXG4gICAgICAgIHdpbmRvdy5jaXJjdWxhclNsaWRlcjIub25SZXNpemUoKTtcclxuICAgICAgICB3aW5kb3cuY2lyY3VsYXJTbGlkZXIzLm9uUmVzaXplKCk7XHJcbiAgICAgICAgd2luZG93LmNpcmN1bGFyU2xpZGVyNC5vblJlc2l6ZSgpO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxufSApKCk7Il0sImZpbGUiOiJ0ZXN0LmpzIn0=
