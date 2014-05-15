$(document).ready(function() {
    window.DDWRT = {};
    DDWRT.ui = {};
    DDWRT.legacy = {};
    DDWRT.legacy.$header = $("#header");
    DDWRT.domUtil = {};
    DDWRT.domUtil.isTextNode = function() {
      // If this is a text node, return true.
      return( this.nodeType === 3 && $.trim($(this).text()).length > 0 );
    };
    
    var $nav = DDWRT.ui.$nav = $("#menuMainList");
    var $header = DDWRT.ui.$header = $('
    <header role="banner" class="banner">
      <div class="primary-nav navbar navbar-inverse navbar-fixed-top">
        <div class="container">
          <a href="/" class="navbar-brand">DD-WRT</a>
          
          <div class="navbar-header">
            <button data-target=".navbar-collapse" data-toggle="collapse" class="navbar-toggle" type="button">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          
          <nav role="navigation" class="collapse pull-right navbar-collapse">
          </nav>
        </div>
      </div>
    </header>');
    var $wrap = DDWRT.ui.$wrap = $("#wrapper");
    var $content = DDWRT.ui.$content = $("#content");
    //remove dd-wrt css
    $('link[href*="style/"]').remove();


    //BUILD OUT BOOTSTRAP3 STRUCTURE
    //THIS SAVES US FROM HAVING TO MODIFY THE DD-WRT BUILD.
    $header.prependTo('body');
    //$header.find('nav').append($iconbar);
    $nav.addClass('nav navbar-nav');
    $nav.find('a strong').contents().unwrap();
    $nav.find('span strong').contents().unwrap();
    $nav.find('span').wrap('<a href="#"></a>');
    $nav.find('a span').contents().unwrap();
    
    var navIconClasses = DDWRT.ui.navIconClasses = {
      'setup':'wrench',
      'wireless':'signal',
      'services':'cogs',
      'security':'shield',
      'accrestriction':'key',
      'applications':'list',
      'admin':'lock',
      'statu':'leaf'
    }
    //find all nav capture scripts, parse, and create li class
    $nav.find('> li > a > script').each(function() {
      var $script = $(this);
      var text = $script.text();
      var $li = $script.parents('li');
      var $link = $li.find('a:first');
      var $icon = $("<i></i>");
      text = text.replace('Capture(','');
      text = text.replace(')','');
      text = text.replace('bmenu.','');
      text = text.toLowerCase();
      
      $li.addClass('menu-' + text);
      $icon.addClass('fa fa-' + navIconClasses[text]);
      $link.prepend($icon);
      $li.find('i').after(' ');
      $link.wrapInner('<span></span>');
      $link.find('script').remove();
      $icon.prependTo($link);
      var $span = $link.find('span');
      $icon.after(' ');
      $span.text($.trim($span.text()));
      $link.attr('title',$span.text());
      //$link.dotdotdot();
      // $link.tooltip({
      //   'placement':'bottom'
      // });
    });
    $nav.find('li.current')
      .addClass('active');

    var $dropdowns = $nav.find('li > div > ul');
    $dropdowns.unwrap().addClass('dropdown-menu');
    $dropdowns.parents('li').addClass('dropdown');
    $dropdowns.each(function() {
      var $this = $(this);
      $this.prev('a')
        .addClass('dropdown-toggle')
        .attr('data-target','#')
        .attr('data-toggle','dropdown')
        .append(" <b class='caret'></b>");
    });
    $nav.appendTo('.primary-nav nav');

    //remove legacy header
    DDWRT.legacy.$header.remove();

    //content areas
    $wrap.addClass('wrap').attr('role','document');
    $content.addClass('content')
      .wrapInner('<main class="main" role="main"><div class="container"><div class="content-wrap"><div class="content-left"></div></div></div></main>');
    $(".content-wrap").append('<div class="content-right"></div>');
    var $subnav = $nav.find('li.current > .dropdown-menu').clone();
    $subnav.attr('id','right-subnav').removeClass('dropdown-menu').addClass('nav');
    $subnav.appendTo(".content-right");
    
    //set active submenu item based on h2 from title
    var $page_title = $content.find('h2:first').clone().children().remove().end().text();
    $subnav.find('a').each(function() {
      var $item = $(this);
      var $text = $item.clone().children().remove().end().text();
      if ($page_title === $text) {
        $item.parents('li').addClass('active');
      }
      //console.log($item.contents()($page_title));
    });
    $("form").addClass('form-horizontal');

    //fix tables in forms 
    $("form table input:not(input[type=checkbox],input[type=radio]),form table select").addClass('form-control');
    //fix settings
    $(".setting").each(function() {
      var $inputWrap = $(this);
      $inputWrap.find('script').remove();
      $inputWrap
        .addClass('form-group');

      $inputWrap
        .wrapInner('<div class="form-control-wrap"></div>');

      var $controlWrap = $inputWrap.find('.form-control-wrap');
      
      var $labelWrap = $inputWrap.find('.label');
      $labelWrap.wrapInner('<label class="control-label"></label>');
      $labelWrap.prependTo($inputWrap);
      var $label = $inputWrap.find('label');
      $label.unwrap();

      //set help-text
      $controlWrap.find('span.default').addClass('help-block');
      //move hidden elements outside of controlWrap
      $controlWrap.find("input[type=hidden]").appendTo($inputWrap);
      //check if contains radio
      var radio_count = $controlWrap.find('input[type=radio]').length;
      if($controlWrap.find('input[type=radio]').length) {
        $controlWrap.find('input[type=radio]').each(function() {
          $(this).add(this.nextSibling).wrapAll('<label/>');
          //if(radio_count > 1) {
            $(this).parents('label').addClass('radio-inline');
          // } else {
          //   $controlWrap.addClass('radio');
          // }
        });
      }
      
      var checkbox_count = $controlWrap.find('input[type=checkbox]').length;
      if(checkbox_count) {
        $controlWrap.find('input[type=checkbox]').each(function() {
          $(this).add(this.nextSibling).wrapAll('<label/>');
          //if(checkbox_count > 1) {
            $(this).parents('label').addClass('checkbox-inline');
          // } else {
          //   $controlWrap.addClass('checkbox');
          // }
        });
      }

      $inputWrap
        .find('input[type=text],input[type=password]')
        .addClass('form-control');

      //fix class="num" inputs
      var $numInputs = $inputWrap
        .find('input.num');

      numInputsCount = $numInputs.length;
      if(numInputsCount > 0) {
        var textNodes = $controlWrap.contents().filter(DDWRT.domUtil.isTextNode);
        //console.log(textNodes);
        $numInputs.each(function() {
          var $numInput = $(this);

          //check for prefix or suffix text on single input.
          if(numInputsCount == 1) {
            if(textNodes.length > 0) {
              //add class to controlWrap for input-group
              $controlWrap.addClass('input-group');
            }
            $(textNodes).each(function() {
              var $node = $(this);
              var text = $.trim($node.text());
              if(text.length > 0) {
                $node.wrap('<span class="input-group-addon"></span>');
              }
            });
            // if(nextNode && nextNode.nodeType == 3) {
            //   //has text suffix
            //   $(nextNode).wrapAll("<span class='num-suffix'></span>");
            // }

            // if(prevNode && prevNode.nodeType == 3) {
            //   //has text prefix
            //   $(prevNode).wrapAll("<span class='num-prefix'></span>");
            // }
          }
          //check for multiple number inputs
          // and divider such as period's for ipv4
          if(numInputsCount > 1) {
            $controlWrap.addClass('input-group');
            var $divider = $(this.nextSibling);
            if($divider.text() === '.') {
              //assume IP or something...
              $divider.wrap('<span class="input-group-addon"/>');
              $controlWrap.find('.input-group-addon').css({
                'border-left':0,
                'border-right':0
              });


            }
          }
          
          $numInput.attr('type','text').addClass('form-control');
        });
      }

      //fix textareas
      var $textareas = $inputWrap.find('textarea');
      var textareasCount = $textareas.length;

      if(textareasCount > 0) {
        $textareas.each(function() {
          var $textarea = $(this);

          $textarea.addClass('form-control');
        });
      }

      //fix selects
      var $selects = $inputWrap.find('select');
      var selectsCount = $selects.length;

      if(selectsCount > 0) {
        $selects.each(function() {
          var $select = $(this);

          $select.addClass('form-control');
        });
      }
      //fix buttons
      var $buttons = $inputWrap.find('input[type=button]');
      var buttonsCount = $buttons.length;

      if(buttonsCount > 0) {
        $buttons.each(function() {
          var $button = $(this);

          $button.addClass('btn btn-default btn-block');
        });
      }

      //fix rest of inputs without a type attribute.
      var $inputs = $controlWrap.find('input');
      $inputs.each(function() {
        var $input = $(this);
        var attr = $input.attr('type');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr === 'undefined' || attr === false) {
            //if it doesn't have a type... add class form-control just to be safe..
            $input.addClass('form-control');
        }
      });
      
    });

    //fix form submit buttons 
    var $formButtonWrap = $(".submitFooter");
    $formButtonWrap.addClass('form-group');
    //$formButtonWrap.wrapInner('<div class="btn-group"></div>');
    $formButtonWrap.find('script').remove();
    $formButtonWrap.prepend('<label class="control-label"></label>');
    var $formButtons = $formButtonWrap.find('input[type=button]');

    $formButtons.each(function() {
      var $btn = $(this);
      $btn.addClass('btn');
      $btn.after(' ');
       //fix save button
      if($btn.attr('name') === 'save_button') {
        $btn.addClass('btn-primary');
      }
      //fix apply button
      else if($btn.attr('name') === 'apply_button') {
        $btn.addClass('btn-default');
      }

      //fix cancel button
      else if($btn.attr('name') === 'cancel_button') {
        $btn.addClass('btn-default');
      }

      //fix reboot button
      else if($btn.attr('name') === 'reboot_button') {
        $btn.addClass('btn-danger');
      }
      else {
        $btn.addClass('btn-default');
      }
    });

    // var curr_bottom = 0;
    // $($(".content-left form h2").get().reverse()).each(function() {
    //   var $h2 = $(this);
    //   var offset = $h2.offset();
    //   var top = offset.top;
    //   var bottom = ($(document).height() - curr_bottom);
    //   console.log($h2);
    //   console.log('top: ' + top);
    //   $h2.affix({
    //     offset: {
    //       top: top
    //     }
    //   });
    //   curr_bottom = top;
    // });
    //console.log($current_subnav_item);
    // DDWRT.ui.$nav
    //   .addClass('navbar navbar-default navbar-fixed-top')
    //   .attr('role','navigation')
    //   .wrapInner('<div class="container"></div>');

    //DDWRT.ui.$nav.find('.container').prepend(DDWRT.ui.$navbarHeader);
});
