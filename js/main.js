class StickyNavigation {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        let self = this;
        $('.menu-item').click(function () {
            self.onTabClick(event, $(this))
        });
        $('#container').scroll(() => {
            this.onScroll()
        });
        $(window).resize(() => {
            this.onResize()
        })
        window.scrollPos = 0;
        window.cursorInIframe = false
        $(document).mousemove((e) => {
           window.cursorInIframe = e.target.className.match(/readerIframe/) ? true : false
        })
    }
    onTabClick(event, element) {
        event.preventDefault();
        let scrollTop = $(element.attr('href')).offset().top + $('#container').scrollTop() - this.tabContainerHeight + 1;
        $('#container').animate({
            scrollTop: scrollTop
        }, 600)
    }
    onScroll() {
        this.checkTabContainerPosition();
        this.findCurrentTabSelector()
        this.fixIframe()
    }
    onResize() {
        if (this.currentId) {
            this.setSliderCss()
        }
    }
    checkTabContainerPosition() {
        let offset = $('.menu-report').height() - this.tabContainerHeight;
        if ($('#container').scrollTop() > offset) {
            $('.menu-report-container').addClass('menu-report-container--top')
        } else {
            $('.menu-report-container').removeClass('menu-report-container--top')
        }
    }
    findCurrentTabSelector(element) {
        let newCurrentId;
        let newCurrentTab;
        let self = this;
        $('.menu-item').each(function () {
            let id = $(this).attr('href');
            let offsetTop = $(id).offset().top - self.tabContainerHeight;
            let offsetBottom = $(id).offset().top + $(id).height() - self.tabContainerHeight;
            if ($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
                newCurrentId = id;
                newCurrentTab = $(this)
            }
        });
        if (this.currentId != newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.setSliderCss()
        }
    }
    setSliderCss() {
        let width = 0;
        let left = 0;
        if (this.currentTab) {
            width = this.currentTab.css('width');
            left = this.currentTab.offset().left
        }
        $('.menu-item-current').css('width', width);
        $('.menu-item-current').css('left', left)
    }
    fixIframe() {
        if (window.cursorInIframe) {
          $('#container').scrollTop(window.scrollPos)
        } else {
          window.scrollPos = $('#container').scrollTop()
        }
    }
}
new StickyNavigation();

jQuery(document).ready(function ($) {
    $("#expand_wrap_toggle").click(function () {
        $("#expand_wrap").slideToggle("slow");
        if ($("#expand_wrap_toggle").text() == "DOWNLOAD THE FULL REPORT ↑") {
            $("#expand_wrap_toggle").html("<span>HIDE ↓</span><br><br>Download the FULL report of China's booming internet landscape and trends in 2018.<br><br>")
        } else {
            $("#expand_wrap_toggle").text("DOWNLOAD THE FULL REPORT ↑")
        }
    })

    $('footer .link').css('width', $('#container')[0].clientWidth)
});
function trigger_ga(signupAbacus, signupSCMPTech)
{
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-6891676-1', 'auto');

	ga('send', 'event', 'China Internet Report Download', 'Newsletter Sign Up', 'China Internet Report Download')

	if (signupAbacus == 1)
	{
		ga('send', 'event', 'China Internet Report Download', 'Newsletter Sign Up', 'Abaucs')
	}

	if (signupSCMPTech == 1)
	{
		ga('send', 'event', 'China Internet Report Download', 'Newsletter Sign Up', 'SCMP Tech Wrap')
	}
}
$(document).on('click',"#submit_btn",function(e) {

    var url = "https://apiwinecircle.scmp.com/newsletter/signup/newsletter_generic_signup_listener.php"; // the script where you handle the form input.

	var type1Val = "";

	var signupAbacus = -1;
	var signupSCMPTech = -1;

	if($('#type1_box').prop('checked')) 
	{
		type1Val = "abacus_pdf";
		signupAbacus = 1;
	}

	var type2Val = "";
	if($('#type2_box').prop('checked')) 
	{
		type2Val = "scmptech_pdf";
		signupSCMPTech = 1;
	}

    var subscribe_json = {
            email: $("#email_box").val(),
		type1: type1Val,
		type2: type2Val,
        };
    $.ajax({
           type: "POST",
           url: url,
           data: subscribe_json, // serializes the form's elements.
           dataType: "json",
           success: function(data)
           { 
               //console.log(data); // show response from the php script.
               if(data['status'] == "success"){
               
			trigger_ga(signupAbacus, signupSCMPTech);

                  $( '#email-field' ).fadeTo( 250, 1, function() {
                  $( '#email-field' ).html("<div class=\"thankyou-text\">SUCCESS! The report is on its way to your inbox, check it out!</div>");
                 
               });
               }else{
                 $( '#email-field' ).fadeTo( 250, 1, function() {
                  $( '#email-field' ).html("<div class=\"error-box\"><div class=\"error-text\">" + data['message'] + "</div></div>");
                 $( '#email-field' ).fadeTo( 1000, 1, function() {
                   $( '#email-field' ).html("<div class=\"email-box-col\"><input type=\"text\" name=\"email\" class=\"email-box\" placeholder=\"Email\" id=\"email_box\"></div><div class=\"button-col\"><button type=\"submit\" class=\"submit_btn\" id=\"submit_btn\"><img src=\"http://widgets.scmp.com/misc/abacus_sub_widget/img/tick.png\" alt=\"submit\" width=\"14\" height=\"11\"></button></div>");
                });
                 
               });
               }
               
           },
           
          error: function () {
            //alert(request.responseText);
             $( '#email-field' ).fadeTo( 250, 1, function() {
                  $( '#email-field' ).html("<div class=\"error-box\"><div class=\"error-text\">Please enter a valid email.</div></div>");
                 $( '#email-field' ).fadeTo( 1000, 1, function() {
                   $( '#email-field' ).html("<div class=\"email-box-col\"><input type=\"text\" name=\"email\" class=\"email-box\" placeholder=\"Email\" id=\"email_box\"></div><div class=\"button-col\"><button type=\"submit\" class=\"submit_btn\" id=\"submit_btn\"><img src=\"http://widgets.scmp.com/misc/abacus_sub_widget/img/tick.png\" alt=\"submit\" width=\"14\" height=\"11\"></button></div>");
                });
                 
               });
          }
          
         });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});