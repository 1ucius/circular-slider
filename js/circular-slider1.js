;'use strict'

startSetup = {

    size:               75,   //in percent (1 to 100)
    slideSize:          15,   //in percent
    animationDuration:  600,  //in ms 1s = 1000ms
    autoplayInterval:   3000, //in ms 1s = 1000ms

}

let circularSlider = {

    wrapper:                document.querySelector( '.wrapper' ),

    slides:                 document.querySelectorAll( '.circular-slider .wrapper .slides-holder .slides-holder__item' ),

    descriptions:           document.querySelector( '.circular-slider .wrapper .descriptions' ),

    slidesHolder:           document.querySelector( '.circular-slider .wrapper .slides-holder' ),

    btnLeft:                document.querySelector( '.circular-slider .wrapper .controls .controls__left' ),

    btnRight:               document.querySelector( '.circular-slider .wrapper .controls .controls__right' ),

    btnAutoplay:            document.querySelector( '.circular-slider .wrapper .controls .controls__autoplay' ),

    currentAngle:           0,

    stepAngle:              2*Math.PI/document.querySelectorAll( '.circular-slider .wrapper .slides-holder .slides-holder__item' ).length,

    currentSlide:           0,

    setSize:                function( radius ) {

                                this.wrapper.style.width = 2*radius + 'px';
                                this.wrapper.style.height = radius + 'px';
                                this.slidesHolder.style.width = this.slidesHolder.style.height = 2*radius*( 1 - slideSize ) + 'px';
                                this.slidesHolder.style.marginTop = radius* slideSize + 'px';
                                this.slidesRepositioning();

                                let s = Math.min( 2*radius*slideSize, circularSlider.stepAngle*radius*( 1 - slideSize ) - 50 );

                                for( let i = 0; i < this.slides.length; i++ ) {
                                    circularSlider.slides[i].style.width = circularSlider.slides[i].style.height = s + 'px';
                                }

                            },

    slidesRepositioning:    function() {

                                let r          = this.slidesHolder.getBoundingClientRect().width/2,
                                    correction = r*startSetup.size/400;

                                for( let i = 0; i < this.slides.length; i++ ) {

                                    let x = r*Math.cos( circularSlider.stepAngle*i - Math.PI/2 ),
                                        y = r*Math.sin( circularSlider.stepAngle*i - Math.PI/2 );
                                    this.slides[i].style.transform = 'translate( ' + x  + 'px, ' + y + 'px ) rotate( ' + this.stepAngle*180/Math.PI*i + 'deg )';
                                    
                                }

                            },
    
    onResize:               function() {

                                let radius,
                                    w = window.innerWidth,
                                    h = window.innerHeight;

                                2*h <= w ? radius = h*wrapperSize
                                        : radius = ( w/2 )*wrapperSize;

                                this.setSize( radius );

                            },

    rotate:                 function(multiplier) {

                                this.disableNav();
                                setTimeout( function(){ circularSlider.setNav() }, startSetup.animationDuration + 20 );
                                if ( autoplay != null ) {
                                    clearInterval(autoplay);
                                    this.setAutoplay(); 
                                }

                                if( this.currentSlide === this.slides.length - 1  && multiplier === -1 ) {

                                    this.slidesHolder.style.transform = 'rotate( -360deg )';

                                    setTimeout( function(){

                                        circularSlider.slidesHolder.style.transitionDuration = 0 + 's';
                                        circularSlider.slidesHolder.style.transform = 'rotate( 0deg )';
                                        circularSlider.currentSlide = 0;
                                        circularSlider.currentAngle = 0;
                                        setTimeout( function() { circularSlider.slidesHolder.style.transitionDuration = startSetup.animationDuration + 'ms'; }, 20 );

                                    }, startSetup.animationDuration )

                                    return;

                                } else if ( this.currentSlide === 0 && multiplier === 1 ) {

                                    this.slidesHolder.style.transform = 'rotate( ' + this.stepAngle*180/Math.PI + 'deg )';

                                    setTimeout( function(){

                                        circularSlider.slidesHolder.style.transitionDuration = 0 + 's';
                                        circularSlider.slidesHolder.style.transform = 'rotate( ' + -( 2*Math.PI - circularSlider.stepAngle )*180/Math.PI + 'deg )';
                                        circularSlider.currentSlide = circularSlider.slides.length - 1;
                                        circularSlider.currentAngle = -( 2*Math.PI - circularSlider.stepAngle )*180/Math.PI;
                                        setTimeout( function() { circularSlider.slidesHolder.style.transitionDuration = startSetup.animationDuration + 'ms'; }, 20 );

                                    }, startSetup.animationDuration );

                                    return;

                                }

                                this.currentSlide -= multiplier;
                                this.currentAngle += ( this.stepAngle*180/Math.PI )*multiplier;
                                this.slidesHolder.style.transform = 'rotate( ' + this.currentAngle + 'deg )';

                            },

    setAutoplay:            function() { autoplay = setInterval( function() { circularSlider.rotate(-1); }, startSetup.autoplayInterval + 20 ); },

    setNav:                 function() {

                                this.btnLeft.onclick = onLeftClick;
                                this.btnRight.onclick = onRightClick;
    
                            },

    disableNav:             function() {

                                this.btnLeft.onclick = null;
                                this.btnRight.onclick = null;

                            }

}

let autoplay,
    wrapperSize = parseFloat( startSetup.size )/100,
    slideSize   = parseFloat( startSetup.slideSize )/100;
circularSlider.slidesHolder.style.transitionDuration = startSetup.animationDuration + 'ms';

circularSlider.onResize();
circularSlider.setAutoplay();
circularSlider.setNav();

function onLeftClick() { circularSlider.rotate(1); };

function onRightClick() { circularSlider.rotate(-1); };

window.onresize = function() {

    circularSlider.disableNav();
    clearInterval(autoplay);
    circularSlider.setAutoplay(); 
    circularSlider.onResize();

}

circularSlider.btnAutoplay.onclick = function() {

    if( this.classList.contains( 'controls__autoplay_running' ) ) {

        this.classList.remove( 'controls__autoplay_running' );
        this.classList.add( 'controls__autoplay_paused' );
        clearInterval(autoplay);
        autoplay = null;

    } else {

        this.classList.remove( 'controls__autoplay_paused' );
        this.classList.add( 'controls__autoplay_running' );
        circularSlider.setAutoplay(); 
    }

}


































































































































// ;'use strict'

// startSetup = {

//     size:               75,   //in percent (1 to 100)
//     slideSize:          15,   //in percent
//     animationDuration:  600,  //in ms 1s = 1000ms
//     autoplayInterval:   3000, //in ms 1s = 1000ms

// }

// let circularSlider = {

//     wrapper:                document.querySelector( '.wrapper' ),

//     slides:                 document.querySelectorAll( '.circular-slider .wrapper .slides-holder .slides-holder__item' ),

//     descriptions:           document.querySelector( '.circular-slider .wrapper .descriptions' ),

//     slidesHolder:           document.querySelector( '.circular-slider .wrapper .slides-holder' ),

//     btnLeft:                document.querySelector( '.circular-slider .wrapper .controls .controls__left' ),

//     btnRight:               document.querySelector( '.circular-slider .wrapper .controls .controls__right' ),

//     btnAutoplay:            document.querySelector( '.circular-slider .wrapper .controls .controls__autoplay' ),

//     currentAngle:           0,

//     stepAngle:              2*Math.PI/document.querySelectorAll( '.circular-slider .wrapper .slides-holder .slides-holder__item' ).length,

//     currentSlide:           0,

//     setSize:                function( radius ) {

//                                 this.wrapper.style.width = 2*radius + 'px';
//                                 this.wrapper.style.height = radius + 'px';
//                                 this.slidesHolder.style.width = this.slidesHolder.style.height = 2*radius*( 1 - slideSize ) + 'px';
//                                 this.slidesHolder.style.marginTop = radius* slideSize + 'px';
//                                 this.slidesRepositioning();

//                                 let s = Math.min( 2*radius*slideSize, circularSlider.stepAngle*radius*( 1 - slideSize ) - 50 );

//                                 for( let i = 0; i < this.slides.length; i++ ) {
//                                     circularSlider.slides[i].style.width = circularSlider.slides[i].style.height = s + 'px';
//                                 }

//                             },

//     slidesRepositioning:    function() {

//                                 let r          = this.slidesHolder.getBoundingClientRect().width/2,
//                                     correction = r*startSetup.size/400;

//                                 for( let i = 0; i < this.slides.length; i++ ) {

//                                     let x = r*Math.cos( circularSlider.stepAngle*i - Math.PI/2 ),
//                                         y = r*Math.sin( circularSlider.stepAngle*i - Math.PI/2 );
//                                     this.slides[i].style.transform = 'translate( ' + x  + 'px, ' + y + 'px ) rotate( ' + this.stepAngle*180/Math.PI*i + 'deg )';
                                    
//                                 }

//                             },
    
//     onResize:               function() {

//                                 let radius,
//                                     w = window.innerWidth,
//                                     h = window.innerHeight;

//                                 2*h <= w ? radius = h*wrapperSize
//                                         : radius = ( w/2 )*wrapperSize;

//                                 this.setSize( radius );

//                             },

//     rotate:                 function(multiplier) {

//                                 this.disableNav();
//                                 setTimeout( function(){ circularSlider.setNav() }, startSetup.animationDuration + 20 );
//                                 if ( autoplay != null ) {
//                                     clearInterval(autoplay);
//                                     this.setAutoplay(); 
//                                 }

//                                 if( this.currentSlide === this.slides.length - 1  && multiplier === -1 ) {

//                                     this.slidesHolder.style.transform = 'rotate( -360deg )';

//                                     setTimeout( function(){

//                                         circularSlider.slidesHolder.style.transitionDuration = 0 + 's';
//                                         circularSlider.slidesHolder.style.transform = 'rotate( 0deg )';
//                                         circularSlider.currentSlide = 0;
//                                         circularSlider.currentAngle = 0;
//                                         setTimeout( function() { circularSlider.slidesHolder.style.transitionDuration = startSetup.animationDuration + 'ms'; }, 20 );

//                                     }, startSetup.animationDuration )

//                                     return;

//                                 } else if ( this.currentSlide === 0 && multiplier === 1 ) {

//                                     this.slidesHolder.style.transform = 'rotate( ' + this.stepAngle*180/Math.PI + 'deg )';

//                                     setTimeout( function(){

//                                         circularSlider.slidesHolder.style.transitionDuration = 0 + 's';
//                                         circularSlider.slidesHolder.style.transform = 'rotate( ' + -( 2*Math.PI - circularSlider.stepAngle )*180/Math.PI + 'deg )';
//                                         circularSlider.currentSlide = circularSlider.slides.length - 1;
//                                         circularSlider.currentAngle = -( 2*Math.PI - circularSlider.stepAngle )*180/Math.PI;
//                                         setTimeout( function() { circularSlider.slidesHolder.style.transitionDuration = startSetup.animationDuration + 'ms'; }, 20 );

//                                     }, startSetup.animationDuration );

//                                     return;

//                                 }

//                                 this.currentSlide -= multiplier;
//                                 this.currentAngle += ( this.stepAngle*180/Math.PI )*multiplier;
//                                 this.slidesHolder.style.transform = 'rotate( ' + this.currentAngle + 'deg )';

//                             },

//     setAutoplay:            function() { autoplay = setInterval( function() { circularSlider.rotate(-1); }, startSetup.autoplayInterval + 20 ); },

//     setNav:                 function() {

//                                 this.btnLeft.onclick = onLeftClick;
//                                 this.btnRight.onclick = onRightClick;
    
//                             },

//     disableNav:             function() {

//                                 this.btnLeft.onclick = null;
//                                 this.btnRight.onclick = null;

//                             }

// }

// let autoplay,
//     wrapperSize = parseFloat( startSetup.size )/100,
//     slideSize   = parseFloat( startSetup.slideSize )/100;
// circularSlider.slidesHolder.style.transitionDuration = startSetup.animationDuration + 'ms';

// circularSlider.onResize();
// circularSlider.setAutoplay();
// circularSlider.setNav();

// function onLeftClick() { circularSlider.rotate(1); };

// function onRightClick() { circularSlider.rotate(-1); };

// window.onresize = function() {

//     circularSlider.disableNav();
//     clearInterval(autoplay);
//     circularSlider.setAutoplay(); 
//     circularSlider.onResize();

// }

// circularSlider.btnAutoplay.onclick = function() {

//     if( this.classList.contains( 'controls__autoplay_running' ) ) {

//         this.classList.remove( 'controls__autoplay_running' );
//         this.classList.add( 'controls__autoplay_paused' );
//         clearInterval(autoplay);
//         autoplay = null;

//     } else {

//         this.classList.remove( 'controls__autoplay_paused' );
//         this.classList.add( 'controls__autoplay_running' );
//         circularSlider.setAutoplay(); 
//     }

// }
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjaXJjdWxhci1zbGlkZXIxLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIjsndXNlIHN0cmljdCdcclxuXHJcbnN0YXJ0U2V0dXAgPSB7XHJcblxyXG4gICAgc2l6ZTogICAgICAgICAgICAgICA3NSwgICAvL2luIHBlcmNlbnQgKDEgdG8gMTAwKVxyXG4gICAgc2xpZGVTaXplOiAgICAgICAgICAxNSwgICAvL2luIHBlcmNlbnRcclxuICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAgNjAwLCAgLy9pbiBtcyAxcyA9IDEwMDBtc1xyXG4gICAgYXV0b3BsYXlJbnRlcnZhbDogICAzMDAwLCAvL2luIG1zIDFzID0gMTAwMG1zXHJcblxyXG59XHJcblxyXG5sZXQgY2lyY3VsYXJTbGlkZXIgPSB7XHJcblxyXG4gICAgd3JhcHBlcjogICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy53cmFwcGVyJyApLFxyXG5cclxuICAgIHNsaWRlczogICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5zbGlkZXMtaG9sZGVyIC5zbGlkZXMtaG9sZGVyX19pdGVtJyApLFxyXG5cclxuICAgIGRlc2NyaXB0aW9uczogICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5kZXNjcmlwdGlvbnMnICksXHJcblxyXG4gICAgc2xpZGVzSG9sZGVyOiAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLnNsaWRlcy1ob2xkZXInICksXHJcblxyXG4gICAgYnRuTGVmdDogICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLmNvbnRyb2xzIC5jb250cm9sc19fbGVmdCcgKSxcclxuXHJcbiAgICBidG5SaWdodDogICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuY29udHJvbHMgLmNvbnRyb2xzX19yaWdodCcgKSxcclxuXHJcbiAgICBidG5BdXRvcGxheTogICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuY29udHJvbHMgLmNvbnRyb2xzX19hdXRvcGxheScgKSxcclxuXHJcbiAgICBjdXJyZW50QW5nbGU6ICAgICAgICAgICAwLFxyXG5cclxuICAgIHN0ZXBBbmdsZTogICAgICAgICAgICAgIDIqTWF0aC5QSS9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuc2xpZGVzLWhvbGRlciAuc2xpZGVzLWhvbGRlcl9faXRlbScgKS5sZW5ndGgsXHJcblxyXG4gICAgY3VycmVudFNsaWRlOiAgICAgICAgICAgMCxcclxuXHJcbiAgICBzZXRTaXplOiAgICAgICAgICAgICAgICBmdW5jdGlvbiggcmFkaXVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUud2lkdGggPSAyKnJhZGl1cyArICdweCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUud2lkdGggPSB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS5oZWlnaHQgPSAyKnJhZGl1cyooIDEgLSBzbGlkZVNpemUgKSArICdweCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUubWFyZ2luVG9wID0gcmFkaXVzKiBzbGlkZVNpemUgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVzUmVwb3NpdGlvbmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcyA9IE1hdGgubWluKCAyKnJhZGl1cypzbGlkZVNpemUsIGNpcmN1bGFyU2xpZGVyLnN0ZXBBbmdsZSpyYWRpdXMqKCAxIC0gc2xpZGVTaXplICkgLSA1MCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHRoaXMuc2xpZGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5zbGlkZXNbaV0uc3R5bGUud2lkdGggPSBjaXJjdWxhclNsaWRlci5zbGlkZXNbaV0uc3R5bGUuaGVpZ2h0ID0gcyArICdweCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgc2xpZGVzUmVwb3NpdGlvbmluZzogICAgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByICAgICAgICAgID0gdGhpcy5zbGlkZXNIb2xkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgvMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdGlvbiA9IHIqc3RhcnRTZXR1cC5zaXplLzQwMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnNsaWRlcy5sZW5ndGg7IGkrKyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4ID0gcipNYXRoLmNvcyggY2lyY3VsYXJTbGlkZXIuc3RlcEFuZ2xlKmkgLSBNYXRoLlBJLzIgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSByKk1hdGguc2luKCBjaXJjdWxhclNsaWRlci5zdGVwQW5nbGUqaSAtIE1hdGguUEkvMiApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCAnICsgeCAgKyAncHgsICcgKyB5ICsgJ3B4ICkgcm90YXRlKCAnICsgdGhpcy5zdGVwQW5nbGUqMTgwL01hdGguUEkqaSArICdkZWcgKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgXHJcbiAgICBvblJlc2l6ZTogICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhZGl1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IHdpbmRvdy5pbm5lcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAyKmggPD0gdyA/IHJhZGl1cyA9IGgqd3JhcHBlclNpemVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcmFkaXVzID0gKCB3LzIgKSp3cmFwcGVyU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTaXplKCByYWRpdXMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgIHJvdGF0ZTogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKG11bHRpcGxpZXIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlTmF2KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXsgY2lyY3VsYXJTbGlkZXIuc2V0TmF2KCkgfSwgc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArIDIwICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBhdXRvcGxheSAhPSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGF1dG9wbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdXRvcGxheSgpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmN1cnJlbnRTbGlkZSA9PT0gdGhpcy5zbGlkZXMubGVuZ3RoIC0gMSAgJiYgbXVsdGlwbGllciA9PT0gLTEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAtMzYwZGVnICknO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCArICdzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmN1bGFyU2xpZGVyLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAwZGVnICknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2lyY3VsYXJTbGlkZXIuY3VycmVudFNsaWRlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmN1bGFyU2xpZGVyLmN1cnJlbnRBbmdsZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHsgY2lyY3VsYXJTbGlkZXIuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHN0YXJ0U2V0dXAuYW5pbWF0aW9uRHVyYXRpb24gKyAnbXMnOyB9LCAyMCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiApXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuY3VycmVudFNsaWRlID09PSAwICYmIG11bHRpcGxpZXIgPT09IDEgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgdGhpcy5zdGVwQW5nbGUqMTgwL01hdGguUEkgKyAnZGVnICknO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCArICdzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmN1bGFyU2xpZGVyLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgLSggMipNYXRoLlBJIC0gY2lyY3VsYXJTbGlkZXIuc3RlcEFuZ2xlICkqMTgwL01hdGguUEkgKyAnZGVnICknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2lyY3VsYXJTbGlkZXIuY3VycmVudFNsaWRlID0gY2lyY3VsYXJTbGlkZXIuc2xpZGVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5jdXJyZW50QW5nbGUgPSAtKCAyKk1hdGguUEkgLSBjaXJjdWxhclNsaWRlci5zdGVwQW5nbGUgKSoxODAvTWF0aC5QSTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkgeyBjaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArICdtcyc7IH0sIDIwICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBzdGFydFNldHVwLmFuaW1hdGlvbkR1cmF0aW9uICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2xpZGUgLT0gbXVsdGlwbGllcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmdsZSArPSAoIHRoaXMuc3RlcEFuZ2xlKjE4MC9NYXRoLlBJICkqbXVsdGlwbGllcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgdGhpcy5jdXJyZW50QW5nbGUgKyAnZGVnICknO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgc2V0QXV0b3BsYXk6ICAgICAgICAgICAgZnVuY3Rpb24oKSB7IGF1dG9wbGF5ID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkgeyBjaXJjdWxhclNsaWRlci5yb3RhdGUoLTEpOyB9LCBzdGFydFNldHVwLmF1dG9wbGF5SW50ZXJ2YWwgKyAyMCApOyB9LFxyXG5cclxuICAgIHNldE5hdjogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ0bkxlZnQub25jbGljayA9IG9uTGVmdENsaWNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuUmlnaHQub25jbGljayA9IG9uUmlnaHRDbGljaztcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICBkaXNhYmxlTmF2OiAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5MZWZ0Lm9uY2xpY2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuUmlnaHQub25jbGljayA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxufVxyXG5cclxubGV0IGF1dG9wbGF5LFxyXG4gICAgd3JhcHBlclNpemUgPSBwYXJzZUZsb2F0KCBzdGFydFNldHVwLnNpemUgKS8xMDAsXHJcbiAgICBzbGlkZVNpemUgICA9IHBhcnNlRmxvYXQoIHN0YXJ0U2V0dXAuc2xpZGVTaXplICkvMTAwO1xyXG5jaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArICdtcyc7XHJcblxyXG5jaXJjdWxhclNsaWRlci5vblJlc2l6ZSgpO1xyXG5jaXJjdWxhclNsaWRlci5zZXRBdXRvcGxheSgpO1xyXG5jaXJjdWxhclNsaWRlci5zZXROYXYoKTtcclxuXHJcbmZ1bmN0aW9uIG9uTGVmdENsaWNrKCkgeyBjaXJjdWxhclNsaWRlci5yb3RhdGUoMSk7IH07XHJcblxyXG5mdW5jdGlvbiBvblJpZ2h0Q2xpY2soKSB7IGNpcmN1bGFyU2xpZGVyLnJvdGF0ZSgtMSk7IH07XHJcblxyXG53aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBjaXJjdWxhclNsaWRlci5kaXNhYmxlTmF2KCk7XHJcbiAgICBjbGVhckludGVydmFsKGF1dG9wbGF5KTtcclxuICAgIGNpcmN1bGFyU2xpZGVyLnNldEF1dG9wbGF5KCk7IFxyXG4gICAgY2lyY3VsYXJTbGlkZXIub25SZXNpemUoKTtcclxuXHJcbn1cclxuXHJcbmNpcmN1bGFyU2xpZGVyLmJ0bkF1dG9wbGF5Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBpZiggdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoICdjb250cm9sc19fYXV0b3BsYXlfcnVubmluZycgKSApIHtcclxuXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCAnY29udHJvbHNfX2F1dG9wbGF5X3J1bm5pbmcnICk7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCAnY29udHJvbHNfX2F1dG9wbGF5X3BhdXNlZCcgKTtcclxuICAgICAgICBjbGVhckludGVydmFsKGF1dG9wbGF5KTtcclxuICAgICAgICBhdXRvcGxheSA9IG51bGw7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCAnY29udHJvbHNfX2F1dG9wbGF5X3BhdXNlZCcgKTtcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoICdjb250cm9sc19fYXV0b3BsYXlfcnVubmluZycgKTtcclxuICAgICAgICBjaXJjdWxhclNsaWRlci5zZXRBdXRvcGxheSgpOyBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIDsndXNlIHN0cmljdCdcclxuXHJcbi8vIHN0YXJ0U2V0dXAgPSB7XHJcblxyXG4vLyAgICAgc2l6ZTogICAgICAgICAgICAgICA3NSwgICAvL2luIHBlcmNlbnQgKDEgdG8gMTAwKVxyXG4vLyAgICAgc2xpZGVTaXplOiAgICAgICAgICAxNSwgICAvL2luIHBlcmNlbnRcclxuLy8gICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAgNjAwLCAgLy9pbiBtcyAxcyA9IDEwMDBtc1xyXG4vLyAgICAgYXV0b3BsYXlJbnRlcnZhbDogICAzMDAwLCAvL2luIG1zIDFzID0gMTAwMG1zXHJcblxyXG4vLyB9XHJcblxyXG4vLyBsZXQgY2lyY3VsYXJTbGlkZXIgPSB7XHJcblxyXG4vLyAgICAgd3JhcHBlcjogICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy53cmFwcGVyJyApLFxyXG5cclxuLy8gICAgIHNsaWRlczogICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5zbGlkZXMtaG9sZGVyIC5zbGlkZXMtaG9sZGVyX19pdGVtJyApLFxyXG5cclxuLy8gICAgIGRlc2NyaXB0aW9uczogICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuY2lyY3VsYXItc2xpZGVyIC53cmFwcGVyIC5kZXNjcmlwdGlvbnMnICksXHJcblxyXG4vLyAgICAgc2xpZGVzSG9sZGVyOiAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLnNsaWRlcy1ob2xkZXInICksXHJcblxyXG4vLyAgICAgYnRuTGVmdDogICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5jaXJjdWxhci1zbGlkZXIgLndyYXBwZXIgLmNvbnRyb2xzIC5jb250cm9sc19fbGVmdCcgKSxcclxuXHJcbi8vICAgICBidG5SaWdodDogICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuY29udHJvbHMgLmNvbnRyb2xzX19yaWdodCcgKSxcclxuXHJcbi8vICAgICBidG5BdXRvcGxheTogICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuY29udHJvbHMgLmNvbnRyb2xzX19hdXRvcGxheScgKSxcclxuXHJcbi8vICAgICBjdXJyZW50QW5nbGU6ICAgICAgICAgICAwLFxyXG5cclxuLy8gICAgIHN0ZXBBbmdsZTogICAgICAgICAgICAgIDIqTWF0aC5QSS9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmNpcmN1bGFyLXNsaWRlciAud3JhcHBlciAuc2xpZGVzLWhvbGRlciAuc2xpZGVzLWhvbGRlcl9faXRlbScgKS5sZW5ndGgsXHJcblxyXG4vLyAgICAgY3VycmVudFNsaWRlOiAgICAgICAgICAgMCxcclxuXHJcbi8vICAgICBzZXRTaXplOiAgICAgICAgICAgICAgICBmdW5jdGlvbiggcmFkaXVzICkge1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUud2lkdGggPSAyKnJhZGl1cyArICdweCc7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUud2lkdGggPSB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS5oZWlnaHQgPSAyKnJhZGl1cyooIDEgLSBzbGlkZVNpemUgKSArICdweCc7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXNIb2xkZXIuc3R5bGUubWFyZ2luVG9wID0gcmFkaXVzKiBzbGlkZVNpemUgKyAncHgnO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVzUmVwb3NpdGlvbmluZygpO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcyA9IE1hdGgubWluKCAyKnJhZGl1cypzbGlkZVNpemUsIGNpcmN1bGFyU2xpZGVyLnN0ZXBBbmdsZSpyYWRpdXMqKCAxIC0gc2xpZGVTaXplICkgLSA1MCApO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHRoaXMuc2xpZGVzLmxlbmd0aDsgaSsrICkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5zbGlkZXNbaV0uc3R5bGUud2lkdGggPSBjaXJjdWxhclNsaWRlci5zbGlkZXNbaV0uc3R5bGUuaGVpZ2h0ID0gcyArICdweCc7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4vLyAgICAgc2xpZGVzUmVwb3NpdGlvbmluZzogICAgZnVuY3Rpb24oKSB7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByICAgICAgICAgID0gdGhpcy5zbGlkZXNIb2xkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgvMixcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdGlvbiA9IHIqc3RhcnRTZXR1cC5zaXplLzQwMDtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnNsaWRlcy5sZW5ndGg7IGkrKyApIHtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4ID0gcipNYXRoLmNvcyggY2lyY3VsYXJTbGlkZXIuc3RlcEFuZ2xlKmkgLSBNYXRoLlBJLzIgKSxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSByKk1hdGguc2luKCBjaXJjdWxhclNsaWRlci5zdGVwQW5nbGUqaSAtIE1hdGguUEkvMiApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCAnICsgeCAgKyAncHgsICcgKyB5ICsgJ3B4ICkgcm90YXRlKCAnICsgdGhpcy5zdGVwQW5nbGUqMTgwL01hdGguUEkqaSArICdkZWcgKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgXHJcbi8vICAgICBvblJlc2l6ZTogICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhZGl1cyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IHdpbmRvdy5pbm5lcldpZHRoLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAyKmggPD0gdyA/IHJhZGl1cyA9IGgqd3JhcHBlclNpemVcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcmFkaXVzID0gKCB3LzIgKSp3cmFwcGVyU2l6ZTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTaXplKCByYWRpdXMgKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuLy8gICAgIHJvdGF0ZTogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKG11bHRpcGxpZXIpIHtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlTmF2KCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXsgY2lyY3VsYXJTbGlkZXIuc2V0TmF2KCkgfSwgc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArIDIwICk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBhdXRvcGxheSAhPSBudWxsICkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGF1dG9wbGF5KTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdXRvcGxheSgpOyBcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmN1cnJlbnRTbGlkZSA9PT0gdGhpcy5zbGlkZXMubGVuZ3RoIC0gMSAgJiYgbXVsdGlwbGllciA9PT0gLTEgKSB7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAtMzYwZGVnICknO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCArICdzJztcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmN1bGFyU2xpZGVyLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAwZGVnICknO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2lyY3VsYXJTbGlkZXIuY3VycmVudFNsaWRlID0gMDtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmN1bGFyU2xpZGVyLmN1cnJlbnRBbmdsZSA9IDA7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHsgY2lyY3VsYXJTbGlkZXIuc2xpZGVzSG9sZGVyLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHN0YXJ0U2V0dXAuYW5pbWF0aW9uRHVyYXRpb24gKyAnbXMnOyB9LCAyMCApO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiApXHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuY3VycmVudFNsaWRlID09PSAwICYmIG11bHRpcGxpZXIgPT09IDEgKSB7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgdGhpcy5zdGVwQW5nbGUqMTgwL01hdGguUEkgKyAnZGVnICknO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCArICdzJztcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmN1bGFyU2xpZGVyLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgLSggMipNYXRoLlBJIC0gY2lyY3VsYXJTbGlkZXIuc3RlcEFuZ2xlICkqMTgwL01hdGguUEkgKyAnZGVnICknO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2lyY3VsYXJTbGlkZXIuY3VycmVudFNsaWRlID0gY2lyY3VsYXJTbGlkZXIuc2xpZGVzLmxlbmd0aCAtIDE7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXJjdWxhclNsaWRlci5jdXJyZW50QW5nbGUgPSAtKCAyKk1hdGguUEkgLSBjaXJjdWxhclNsaWRlci5zdGVwQW5nbGUgKSoxODAvTWF0aC5QSTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkgeyBjaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArICdtcyc7IH0sIDIwICk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBzdGFydFNldHVwLmFuaW1hdGlvbkR1cmF0aW9uICk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2xpZGUgLT0gbXVsdGlwbGllcjtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmdsZSArPSAoIHRoaXMuc3RlcEFuZ2xlKjE4MC9NYXRoLlBJICkqbXVsdGlwbGllcjtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlc0hvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCAnICsgdGhpcy5jdXJyZW50QW5nbGUgKyAnZGVnICknO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4vLyAgICAgc2V0QXV0b3BsYXk6ICAgICAgICAgICAgZnVuY3Rpb24oKSB7IGF1dG9wbGF5ID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkgeyBjaXJjdWxhclNsaWRlci5yb3RhdGUoLTEpOyB9LCBzdGFydFNldHVwLmF1dG9wbGF5SW50ZXJ2YWwgKyAyMCApOyB9LFxyXG5cclxuLy8gICAgIHNldE5hdjogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ0bkxlZnQub25jbGljayA9IG9uTGVmdENsaWNrO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuUmlnaHQub25jbGljayA9IG9uUmlnaHRDbGljaztcclxuICAgIFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbi8vICAgICBkaXNhYmxlTmF2OiAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5MZWZ0Lm9uY2xpY2sgPSBudWxsO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuUmlnaHQub25jbGljayA9IG51bGw7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuLy8gfVxyXG5cclxuLy8gbGV0IGF1dG9wbGF5LFxyXG4vLyAgICAgd3JhcHBlclNpemUgPSBwYXJzZUZsb2F0KCBzdGFydFNldHVwLnNpemUgKS8xMDAsXHJcbi8vICAgICBzbGlkZVNpemUgICA9IHBhcnNlRmxvYXQoIHN0YXJ0U2V0dXAuc2xpZGVTaXplICkvMTAwO1xyXG4vLyBjaXJjdWxhclNsaWRlci5zbGlkZXNIb2xkZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gc3RhcnRTZXR1cC5hbmltYXRpb25EdXJhdGlvbiArICdtcyc7XHJcblxyXG4vLyBjaXJjdWxhclNsaWRlci5vblJlc2l6ZSgpO1xyXG4vLyBjaXJjdWxhclNsaWRlci5zZXRBdXRvcGxheSgpO1xyXG4vLyBjaXJjdWxhclNsaWRlci5zZXROYXYoKTtcclxuXHJcbi8vIGZ1bmN0aW9uIG9uTGVmdENsaWNrKCkgeyBjaXJjdWxhclNsaWRlci5yb3RhdGUoMSk7IH07XHJcblxyXG4vLyBmdW5jdGlvbiBvblJpZ2h0Q2xpY2soKSB7IGNpcmN1bGFyU2xpZGVyLnJvdGF0ZSgtMSk7IH07XHJcblxyXG4vLyB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuXHJcbi8vICAgICBjaXJjdWxhclNsaWRlci5kaXNhYmxlTmF2KCk7XHJcbi8vICAgICBjbGVhckludGVydmFsKGF1dG9wbGF5KTtcclxuLy8gICAgIGNpcmN1bGFyU2xpZGVyLnNldEF1dG9wbGF5KCk7IFxyXG4vLyAgICAgY2lyY3VsYXJTbGlkZXIub25SZXNpemUoKTtcclxuXHJcbi8vIH1cclxuXHJcbi8vIGNpcmN1bGFyU2xpZGVyLmJ0bkF1dG9wbGF5Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHJcbi8vICAgICBpZiggdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoICdjb250cm9sc19fYXV0b3BsYXlfcnVubmluZycgKSApIHtcclxuXHJcbi8vICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCAnY29udHJvbHNfX2F1dG9wbGF5X3J1bm5pbmcnICk7XHJcbi8vICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCAnY29udHJvbHNfX2F1dG9wbGF5X3BhdXNlZCcgKTtcclxuLy8gICAgICAgICBjbGVhckludGVydmFsKGF1dG9wbGF5KTtcclxuLy8gICAgICAgICBhdXRvcGxheSA9IG51bGw7XHJcblxyXG4vLyAgICAgfSBlbHNlIHtcclxuXHJcbi8vICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCAnY29udHJvbHNfX2F1dG9wbGF5X3BhdXNlZCcgKTtcclxuLy8gICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoICdjb250cm9sc19fYXV0b3BsYXlfcnVubmluZycgKTtcclxuLy8gICAgICAgICBjaXJjdWxhclNsaWRlci5zZXRBdXRvcGxheSgpOyBcclxuLy8gICAgIH1cclxuXHJcbi8vIH0iXSwiZmlsZSI6ImNpcmN1bGFyLXNsaWRlcjEuanMifQ==
