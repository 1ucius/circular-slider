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

        this.slidesSize           = 0;

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
        this.addStyle();

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

        this.setSize( Math.round( radius ) );

    };

    Slider.prototype.setSize = function( radius ) {

        this.wrapper.style.width  = 2*radius + 'px';
        this.wrapper.style.height = radius + 'px';

        let r                         = 2*radius*( 1 - this.startSetup.slideSize );
        this.slidesHolder.style.width = this.slidesHolder.style.height = r + 'px';
        this.slidesRepositioning( r/2 );

        this.slidesHolder.style.marginTop    = radius*this.startSetup.slideSize + 'px';
        this.descriptionsHolder.style.width  = ( r/2 - r*this.startSetup.slideSize + 20)*2 + 'px';
        this.descriptionsHolder.style.height = r/2 - r*this.startSetup.slideSize + 20 + 'px';

        this.slidesSize                        = Math.min( 2*radius*this.startSetup.slideSize, this.stepAngle*radius*( 1 - this.startSetup.slideSize ) - 50 );
        this.descriptionsHolder.style.fontSize = window.innerHeight < window.innerWidth ? '1.2vh'
                                                                                        :  '1.2vw';
        for( let i = 0; i < this.slides.length; i++ ) {
            this.slides[i].style.width = this.slides[i].style.height = this.slidesSize + 'px';
        };

    };

    Slider.prototype.slidesRepositioning = function( r ) {

        for( let i = 0; i < this.slides.length; i++ ) {

            let x = r*Math.cos( this.stepAngle*i - Math.PI/2 ),
                y = r*Math.sin( this.stepAngle*i - Math.PI/2 );
            this.slides[i].style.transform = 'translate( ' + x  + 'px, ' + y + 'px ) rotate( ' + this.stepAngle*180/Math.PI*i + 'deg )';

        };

    };

    Slider.prototype.rotate = function( multiplier ) {

        let _this = this;

        this.removeStyle();
        this.resetNavs();

        if( this.currentSlide === this.slides.length - 1  && multiplier === -1 ) {

            this.slidesHolder.style.transform     = 'rotate( -360deg )';
            this.currentSlide = this.currentAngle = 0;
            this.addStyle();

            setTimeout( function(){

                _this.slidesHolder.style.transitionDuration = 0 + 's';
                _this.slidesHolder.style.transform          = 'rotate( ' + _this.currentAngle + 'deg )';
                setTimeout( function() { _this.slidesHolder.style.transitionDuration = _this.startSetup.animationDuration + 'ms'; }, 20 );

            }, this.startSetup.animationDuration );

        } else if ( this.currentSlide === 0 && multiplier === 1 ) {

            this.slidesHolder.style.transform = 'rotate( ' + this.stepAngle*180/Math.PI + 'deg )';
            this.currentSlide                 = _this.slides.length - 1;
            this.currentAngle                 = -( 2*Math.PI - _this.stepAngle )*180/Math.PI;
            this.addStyle();

            setTimeout( function(){

                _this.slidesHolder.style.transitionDuration = 0 + 's';
                _this.slidesHolder.style.transform = 'rotate( ' + _this.currentAngle + 'deg )';
                setTimeout( function() { _this.slidesHolder.style.transitionDuration = _this.startSetup.animationDuration + 'ms'; }, 20 );

            }, this.startSetup.animationDuration );

        } else {

            this.currentSlide                -= multiplier;
            this.currentAngle                += ( this.stepAngle*180/Math.PI )*multiplier;
            this.slidesHolder.style.transform = 'rotate( ' + this.currentAngle + 'deg )';
            this.addStyle();

        };

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

    Slider.prototype.removeStyle = function() {

        let x = this.currentSlide;

        this.descriptions[x].classList.remove( 'descriptions__item_visible' );
        this.slides[x].classList.remove( 'slides-holder__item_active' );
        this.slides[x].style.height = this.slides[x].style.width = this.slidesSize + 'px';

    };

    Slider.prototype.addStyle = function() {

        let x = this.currentSlide;

        this.descriptions[x].classList.add( 'descriptions__item_visible' );
        this.slides[x].classList.add( 'slides-holder__item_active' );
        this.slides[x].style.height = this.slides[x].style.width = this.slidesSize + 20 + 'px';

    };

    Slider.prototype.resetNavs = function() {

        let _this = this;

        this.disableNav();
        setTimeout( function(){ _this.setNav() }, this.startSetup.animationDuration + 20 );
        if ( this.autoplay != null ) {
            clearInterval( this.autoplay );
            this.setAutoplay();
        };

    };

    ///////////Init sliders/////////// 
    window.circularSlider1 = new Slider( document.querySelector( '.circular-slider-1' ), 100, 15, 600, 2500 );
    window.circularSlider2 = new Slider( document.querySelector( '.circular-slider-2' ), 90, 13, 700, 3000 );
    window.circularSlider3 = new Slider( document.querySelector( '.circular-slider-3' ), 80, 18, 800, 3700 );
    window.circularSlider4 = new Slider( document.querySelector( '.circular-slider-4' ), 70, 20, 900, 4200 );

    let sliders = [ window.circularSlider1, window.circularSlider2, window.circularSlider3, window.circularSlider4 ];
 
    window.onresize = function() {

        for ( let i = 0; i < sliders.length; i++ ){

            sliders[i].resetNavs();
            sliders[i].onResize();

        };

    };
    //////////////////////

} )();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjaXJjdWxhci1zbGlkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKCBmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBmdW5jdGlvbiBzdGFydFNldHVwKCBzbGlkZXJTaXplLCBzbGlkZVNpemUsIGFuaW1hdGlvbkR1cmF0aW9uLCBhdXRvcGxheUludGVydmFsICkge1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlclNpemUgICAgICAgID0gcGFyc2VGbG9hdCggc2xpZGVyU2l6ZSApLzEwMDtcclxuICAgICAgICB0aGlzLnNsaWRlU2l6ZSAgICAgICAgID0gcGFyc2VGbG9hdCggc2xpZGVTaXplICkvMTAwO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRHVyYXRpb24gPSBwYXJzZUZsb2F0KCBhbmltYXRpb25EdXJhdGlvbiApO1xyXG4gICAgICAgIHRoaXMuYXV0b3BsYXlJbnRlcnZhbCAgPSBwYXJzZUZsb2F0KCBhdXRvcGxheUludGVydmFsICk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBTbGlkZXIoIG5ld1NsaWRlciwgc2xpZGVyU2l6ZSwgc2xpZGVTaXplLCBhbmltYXRpb25EdXJhdGlvbiwgYXV0b3BsYXlJbnRlcnZhbCApIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydFNldHVwICAgICAgICAgICA9IG5ldyBzdGFydFNldHVwKCBzbGlkZXJTaXplLCBzbGlkZVNpemUsIGFuaW1hdGlvbkR1cmF0aW9uLCBhdXRvcGxheUludGVydmFsICksXHJcblxyXG4gICAgICAgIHRoaXMud3JhcHBlciAgICAgICAgICAgICAgPSBuZXdTbGlkZXIucXVlcnlTZWxlY3RvciggJy53cmFwcGVyJyApO1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlcyAgICAgICAgICAgICAgID0gbmV3U2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5zbGlkZXMtaG9sZGVyIC5zbGlkZXMtaG9sZGVyX19pdGVtJyApO1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlc1NpemUgICAgICAgICAgID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnNIb2xkZXIgICA9IG5ld1NsaWRlci5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuZGVzY3JpcHRpb25zJyApO1xyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9ucyAgICAgICAgID0gbmV3U2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5kZXNjcmlwdGlvbnMgLmRlc2NyaXB0aW9uc19faXRlbScgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIgICAgICAgICA9IG5ld1NsaWRlci5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuc2xpZGVzLWhvbGRlcicgKTtcclxuXHJcbiAgICAgICAgdGhpcy5idG5MZWZ0ICAgICAgICAgICAgICA9IG5ld1NsaWRlci5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuY29udHJvbHMgLmNvbnRyb2xzX19sZWZ0JyApO1xyXG5cclxuICAgICAgICB0aGlzLmJ0blJpZ2h0ICAgICAgICAgICAgID0gbmV3U2xpZGVyLnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5jb250cm9scyAuY29udHJvbHNfX3JpZ2h0JyApO1xyXG5cclxuICAgICAgICB0aGlzLmJ0bkF1dG9wbGF5ICAgICAgICAgID0gbmV3U2xpZGVyLnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5jb250cm9scyAuY29udHJvbHNfX2F1dG9wbGF5JyApO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRBbmdsZSAgICAgICAgID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwQW5nbGUgICAgICAgICAgICA9IDIqTWF0aC5QSS9uZXdTbGlkZXIucXVlcnlTZWxlY3RvckFsbCggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLnNsaWRlcy1ob2xkZXIgLnNsaWRlcy1ob2xkZXJfX2l0ZW0nICkubGVuZ3RoO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTbGlkZSAgICAgICAgID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gdGhpcy5zdGFydFNldHVwLmFuaW1hdGlvbkR1cmF0aW9uICsgJ21zJztcclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBdXRvcGxheSgpO1xyXG4gICAgICAgIHRoaXMuc2V0TmF2KCk7XHJcbiAgICAgICAgdGhpcy5hZGRTdHlsZSgpO1xyXG5cclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYnRuQXV0b3BsYXkub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYoIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCAnY29udHJvbHNfX2F1dG9wbGF5X3J1bm5pbmcnICkgKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoICdjb250cm9sc19fYXV0b3BsYXlfcnVubmluZycgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCggJ2NvbnRyb2xzX19hdXRvcGxheV9wYXVzZWQnICk7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKCBfdGhpcy5hdXRvcGxheSApO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYXV0b3BsYXkgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCAnY29udHJvbHNfX2F1dG9wbGF5X3BhdXNlZCcgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCggJ2NvbnRyb2xzX19hdXRvcGxheV9ydW5uaW5nJyApO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QXV0b3BsYXkoKTsgXHJcbiAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5vblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgcmFkaXVzLFxyXG4gICAgICAgICAgICB3ID0gdGhpcy53cmFwcGVyLnBhcmVudE5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXHJcbiAgICAgICAgICAgIGggPSB0aGlzLndyYXBwZXIucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIDIqaCA8PSB3ID8gcmFkaXVzID0gaCp0aGlzLnN0YXJ0U2V0dXAuc2xpZGVyU2l6ZVxyXG4gICAgICAgICAgICAgICAgIDogcmFkaXVzID0gKCB3LzIgKSp0aGlzLnN0YXJ0U2V0dXAuc2xpZGVyU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTaXplKCBNYXRoLnJvdW5kKCByYWRpdXMgKSApO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24oIHJhZGl1cyApIHtcclxuXHJcbiAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLndpZHRoICA9IDIqcmFkaXVzICsgJ3B4JztcclxuICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcclxuXHJcbiAgICAgICAgbGV0IHIgICAgICAgICAgICAgICAgICAgICAgICAgPSAyKnJhZGl1cyooIDEgLSB0aGlzLnN0YXJ0U2V0dXAuc2xpZGVTaXplICk7XHJcbiAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUud2lkdGggPSB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS5oZWlnaHQgPSByICsgJ3B4JztcclxuICAgICAgICB0aGlzLnNsaWRlc1JlcG9zaXRpb25pbmcoIHIvMiApO1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS5tYXJnaW5Ub3AgICAgPSByYWRpdXMqdGhpcy5zdGFydFNldHVwLnNsaWRlU2l6ZSArICdweCc7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnNIb2xkZXIuc3R5bGUud2lkdGggID0gKCByLzIgLSByKnRoaXMuc3RhcnRTZXR1cC5zbGlkZVNpemUgKyAyMCkqMiArICdweCc7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnNIb2xkZXIuc3R5bGUuaGVpZ2h0ID0gci8yIC0gcip0aGlzLnN0YXJ0U2V0dXAuc2xpZGVTaXplICsgMjAgKyAncHgnO1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlc1NpemUgICAgICAgICAgICAgICAgICAgICAgICA9IE1hdGgubWluKCAyKnJhZGl1cyp0aGlzLnN0YXJ0U2V0dXAuc2xpZGVTaXplLCB0aGlzLnN0ZXBBbmdsZSpyYWRpdXMqKCAxIC0gdGhpcy5zdGFydFNldHVwLnNsaWRlU2l6ZSApIC0gNTAgKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uc0hvbGRlci5zdHlsZS5mb250U2l6ZSA9IHdpbmRvdy5pbm5lckhlaWdodCA8IHdpbmRvdy5pbm5lcldpZHRoID8gJzEuMnZoJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAgJzEuMnZ3JztcclxuICAgICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHRoaXMuc2xpZGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlc1tpXS5zdHlsZS53aWR0aCA9IHRoaXMuc2xpZGVzW2ldLnN0eWxlLmhlaWdodCA9IHRoaXMuc2xpZGVzU2l6ZSArICdweCc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWRlci5wcm90b3R5cGUuc2xpZGVzUmVwb3NpdGlvbmluZyA9IGZ1bmN0aW9uKCByICkge1xyXG5cclxuICAgICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHRoaXMuc2xpZGVzLmxlbmd0aDsgaSsrICkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHggPSByKk1hdGguY29zKCB0aGlzLnN0ZXBBbmdsZSppIC0gTWF0aC5QSS8yICksXHJcbiAgICAgICAgICAgICAgICB5ID0gcipNYXRoLnNpbiggdGhpcy5zdGVwQW5nbGUqaSAtIE1hdGguUEkvMiApO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCAnICsgeCAgKyAncHgsICcgKyB5ICsgJ3B4ICkgcm90YXRlKCAnICsgdGhpcy5zdGVwQW5nbGUqMTgwL01hdGguUEkqaSArICdkZWcgKSc7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGlkZXIucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKCBtdWx0aXBsaWVyICkge1xyXG5cclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZVN0eWxlKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldE5hdnMoKTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuY3VycmVudFNsaWRlID09PSB0aGlzLnNsaWRlcy5sZW5ndGggLSAxICAmJiBtdWx0aXBsaWVyID09PSAtMSApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zZm9ybSAgICAgPSAncm90YXRlKCAtMzYwZGVnICknO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTbGlkZSA9IHRoaXMuY3VycmVudEFuZ2xlID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hZGRTdHlsZSgpO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCArICdzJztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gICAgICAgICAgPSAncm90YXRlKCAnICsgX3RoaXMuY3VycmVudEFuZ2xlICsgJ2RlZyApJztcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkgeyBfdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gX3RoaXMuc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArICdtcyc7IH0sIDIwICk7XHJcblxyXG4gICAgICAgICAgICB9LCB0aGlzLnN0YXJ0U2V0dXAuYW5pbWF0aW9uRHVyYXRpb24gKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5jdXJyZW50U2xpZGUgPT09IDAgJiYgbXVsdGlwbGllciA9PT0gMSApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoICcgKyB0aGlzLnN0ZXBBbmdsZSoxODAvTWF0aC5QSSArICdkZWcgKSc7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNsaWRlICAgICAgICAgICAgICAgICA9IF90aGlzLnNsaWRlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmdsZSAgICAgICAgICAgICAgICAgPSAtKCAyKk1hdGguUEkgLSBfdGhpcy5zdGVwQW5nbGUgKSoxODAvTWF0aC5QSTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTdHlsZSgpO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCArICdzJztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgX3RoaXMuY3VycmVudEFuZ2xlICsgJ2RlZyApJztcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkgeyBfdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gX3RoaXMuc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArICdtcyc7IH0sIDIwICk7XHJcblxyXG4gICAgICAgICAgICB9LCB0aGlzLnN0YXJ0U2V0dXAuYW5pbWF0aW9uRHVyYXRpb24gKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNsaWRlICAgICAgICAgICAgICAgIC09IG11bHRpcGxpZXI7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuZ2xlICAgICAgICAgICAgICAgICs9ICggdGhpcy5zdGVwQW5nbGUqMTgwL01hdGguUEkgKSptdWx0aXBsaWVyO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgdGhpcy5jdXJyZW50QW5nbGUgKyAnZGVnICknO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFN0eWxlKCk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGlkZXIucHJvdG90eXBlLnNldE5hdiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgX3RoaXMgICAgICAgICAgICAgID0gdGhpcztcclxuICAgICAgICBfdGhpcy5idG5MZWZ0Lm9uY2xpY2sgID0gZnVuY3Rpb24oKSB7IF90aGlzLnJvdGF0ZSgxKSB9O1xyXG4gICAgICAgIF90aGlzLmJ0blJpZ2h0Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHsgX3RoaXMucm90YXRlKC0xKSB9O1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5kaXNhYmxlTmF2ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYnRuTGVmdC5vbmNsaWNrICA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5idG5SaWdodC5vbmNsaWNrID0gbnVsbDtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWRlci5wcm90b3R5cGUuc2V0QXV0b3BsYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgX3RoaXMgICAgID0gdGhpcztcclxuICAgICAgICB0aGlzLmF1dG9wbGF5ID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkgeyBfdGhpcy5yb3RhdGUoLTEpIH0sIF90aGlzLnN0YXJ0U2V0dXAuYXV0b3BsYXlJbnRlcnZhbCArIDIwICk7IFxyXG4gICAgfTtcclxuXHJcbiAgICBTbGlkZXIucHJvdG90eXBlLnJlbW92ZVN0eWxlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGxldCB4ID0gdGhpcy5jdXJyZW50U2xpZGU7XHJcblxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25zW3hdLmNsYXNzTGlzdC5yZW1vdmUoICdkZXNjcmlwdGlvbnNfX2l0ZW1fdmlzaWJsZScgKTtcclxuICAgICAgICB0aGlzLnNsaWRlc1t4XS5jbGFzc0xpc3QucmVtb3ZlKCAnc2xpZGVzLWhvbGRlcl9faXRlbV9hY3RpdmUnICk7XHJcbiAgICAgICAgdGhpcy5zbGlkZXNbeF0uc3R5bGUuaGVpZ2h0ID0gdGhpcy5zbGlkZXNbeF0uc3R5bGUud2lkdGggPSB0aGlzLnNsaWRlc1NpemUgKyAncHgnO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5hZGRTdHlsZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgeCA9IHRoaXMuY3VycmVudFNsaWRlO1xyXG5cclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uc1t4XS5jbGFzc0xpc3QuYWRkKCAnZGVzY3JpcHRpb25zX19pdGVtX3Zpc2libGUnICk7XHJcbiAgICAgICAgdGhpcy5zbGlkZXNbeF0uY2xhc3NMaXN0LmFkZCggJ3NsaWRlcy1ob2xkZXJfX2l0ZW1fYWN0aXZlJyApO1xyXG4gICAgICAgIHRoaXMuc2xpZGVzW3hdLnN0eWxlLmhlaWdodCA9IHRoaXMuc2xpZGVzW3hdLnN0eWxlLndpZHRoID0gdGhpcy5zbGlkZXNTaXplICsgMjAgKyAncHgnO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpZGVyLnByb3RvdHlwZS5yZXNldE5hdnMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5kaXNhYmxlTmF2KCk7XHJcbiAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXsgX3RoaXMuc2V0TmF2KCkgfSwgdGhpcy5zdGFydFNldHVwLmFuaW1hdGlvbkR1cmF0aW9uICsgMjAgKTtcclxuICAgICAgICBpZiAoIHRoaXMuYXV0b3BsYXkgIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCggdGhpcy5hdXRvcGxheSApO1xyXG4gICAgICAgICAgICB0aGlzLnNldEF1dG9wbGF5KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vSW5pdCBzbGlkZXJzLy8vLy8vLy8vLy8gXHJcbiAgICB3aW5kb3cuY2lyY3VsYXJTbGlkZXIxID0gbmV3IFNsaWRlciggZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXItMScgKSwgMTAwLCAxNSwgNjAwLCAyNTAwICk7XHJcbiAgICB3aW5kb3cuY2lyY3VsYXJTbGlkZXIyID0gbmV3IFNsaWRlciggZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXItMicgKSwgOTAsIDEzLCA3MDAsIDMwMDAgKTtcclxuICAgIHdpbmRvdy5jaXJjdWxhclNsaWRlcjMgPSBuZXcgU2xpZGVyKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlci0zJyApLCA4MCwgMTgsIDgwMCwgMzcwMCApO1xyXG4gICAgd2luZG93LmNpcmN1bGFyU2xpZGVyNCA9IG5ldyBTbGlkZXIoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyLTQnICksIDcwLCAyMCwgOTAwLCA0MjAwICk7XHJcblxyXG4gICAgbGV0IHNsaWRlcnMgPSBbIHdpbmRvdy5jaXJjdWxhclNsaWRlcjEsIHdpbmRvdy5jaXJjdWxhclNsaWRlcjIsIHdpbmRvdy5jaXJjdWxhclNsaWRlcjMsIHdpbmRvdy5jaXJjdWxhclNsaWRlcjQgXTtcclxuIFxyXG4gICAgd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHNsaWRlcnMubGVuZ3RoOyBpKysgKXtcclxuXHJcbiAgICAgICAgICAgIHNsaWRlcnNbaV0ucmVzZXROYXZzKCk7XHJcbiAgICAgICAgICAgIHNsaWRlcnNbaV0ub25SZXNpemUoKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9O1xyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxufSApKCk7Il0sImZpbGUiOiJjaXJjdWxhci1zbGlkZXIuanMifQ==
