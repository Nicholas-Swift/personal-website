$(function() {
    $(window).scroll( function(){
    
       
        $('.fadeInBlock').each( function(i){
            
            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var middle_of_object = $(this).position().top + $(this).outerHeight()/2;
            var top_of_object = $(this).position().top

            var bottom_of_window = $(window).scrollTop() + $(window).height();
            var middle_of_window = $(window).scrollTop() + $(window).height()/5;
            var top_of_window = $(window).scrollTop();
            
            /* Adjust the "200" to either have a delay or that the content starts fading a bit before you reach it  */
            bottom_of_window = bottom_of_window;

            if( middle_of_window > top_of_object) {
                $(this).stop( true, true );
                $(this).animate({'opacity':'1'}, 500);
            }
            else if( bottom_of_window > top_of_object ) {
                $(this).animate({'opacity':'1'}, 800);
            }
        });
    
    });
});