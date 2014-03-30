$.fn.customSelect = function () {

    /* 
        IE7 and below not supported. Fallback to html select
    */
    if (navigator.appVersion.indexOf("MSIE 7.") != -1){ //test for MSIE x.x;
        var ieversion = new Number(RegExp.$1); // capture x.x portion and store as a number
        if (ieversion<=7) {
            return;
        }
    }

    var $selectbox = this;

    var select = new selectAttributes();         //represents html select as an object
    var selector = new makeSelectors(select.id); // object that holds various css selectors for custom select

    var optionId = select.id + '_option';        //used for aria active descendant tracking purpose of current option
    

    /*  ===== if existing already remove exiting instance of this custom select in order to create fresh instance ====== */
    if ($(selector.container).length) {
        $(selector.container).remove();
    }

    /* ================ Creating DOM structure for the custom dropdown options section ================== */
    var selectDropDownDOM = '<ul class="dropdown" role="listbox" aria-live="polite" aria-expanded="true">';
        select.options.each(function (option) {
            selectDropDownDOM += '<li role="option" data-option-array-index="'+ (option + 1) +'" data-value="' + $(this).val() + '"';
            if ($(this).is(':selected')) {
                selectDropDownDOM+= ' aria-selected="true" class="highlighted selected" id="'+select.id+'_option"';
                select.displayText = $(this).text();
            } else {
                selectDropDownDOM+= ' aria-selected="false"';
            }
            selectDropDownDOM += '>' + $(this).text() + '</li>';
        });
        selectDropDownDOM += '</ul>';

    /* ========================================== Creating DOM structure for custom select ===================================== */
    var customSelectDOM  = '<div class="custom_select_container" id="custom_' + select.id + '">';
        customSelectDOM += '<input type="hidden" name="' + select.name + '" value="' + select.value + '" class="custom_select_val_field"/>';
        customSelectDOM += '<input type="text" value="' + select.displayText + '" tabindex="0" class="custom_select_input" id="custom_'+select.id+'" role="combobox" aria-autocomplete="listbox" aria-labelledby="' + select.id + '_label" aria-activedescendant=' + select.id + '_option"/>';
        customSelectDOM += '<a tabindex="-1" class="custom_select_display"><span>' + select.displayText + '</span><div><b></b></div></a>';
        customSelectDOM += selectDropDownDOM;
        customSelectDOM +='</div>';

    /* ===================================  Adding custom select into the html dom structure ==================================== */
    $selectbox.after(customSelectDOM);

    /* ======================= Creating jquery handles to the container and custom selectbox focus elements ======================= */
    var $container = $(selector.container);
    var $customSelectElement = $(selector.handle);
    $(selector.uiBox).width(select.width);

    /* ======================== Class function to create an object consisting of all select attributes ============================ */
    function selectAttributes () {
        this.width   = $selectbox.width();
        this.options = $selectbox.children();
        this.value   = $selectbox.val();
        this.name    = $selectbox.attr('name');
        this.id      = $selectbox.attr('id');
        this.displayText    = 'Select';
    }

    /* =============== Class function to create an object consisting of all css selectors required for custom select ============= */
    function makeSelectors (id) {
        this.container      = '#custom_' + id;
        this.selectedOption = '#' + id + '_option';
        this.hidden         = this.container + ' .custom_select_val_field';
        this.uiBox        = this.container + ' .custom_select_display';
        this.handle         = this.container + ' .custom_select_input';
        this.displayText           = this.container + ' .custom_select_display span';
        this.listoptions        = this.container + ' .dropdown li';
        this.selected       = this.container + ' .selected';
        this.label          = 'label[for="' + id + '"]';
    }

    /* ================ key code handling function class - for better readability - stores all keycodes by name ================ */
    function keyCodes() {
      // Define values for keycodes
      this.backspace  = 8;
      this.tab        = 9;
      this.enter      = 13;
      this.esc        = 27;

      this.space      = 32;
      this.pageup     = 33;
      this.pagedown   = 34;
      this.end        = 35;
      this.home       = 36;

      this.up         = 38;
      this.down       = 40; 
      
      this.del        = 46;

    } // end keyCodes
    var key = new keyCodes();
    // End key code handling

    /* =========== Handle click event on custom selectbox  ================ */
    //On click toggle dropdown display
    $('body').on('click', selector.uiBox, function (e) {
        e.preventDefault();
        var $this = $(this);
        if(!$container.hasClass('expanded')) {
            $container.addClass('expanded');
            $container.find('.selected').addClass('highlighted').attr('tabindex',0).focus();
        } else {
            $container.removeClass('expanded');
            $this.focus();
        }
    });

    $('body').click(function (e) {
        console.log('here');
        if ($(e.target).parents().index($container) == -1) {
            $container.removeClass('expanded');
            $(selector.listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            console.log('in here');
        }
    });

    /* ============ Handling focus of custom select box/ options ============== */
    $('body').on('focus', selector.handle + ' ,' + selector.listoptions, function (e) {
        $container.addClass('active');
    });
    $('body').on('blur', selector.handle + ', '+ selector.listoptions, function (e) {
            if(!$(selector.contaner + ' .dropdown li').is(':focus') && !$customSelectElement.is(':focus')) {
                $container.removeClass('active');
            }
    });

    /* ================ Handle mouse events on dropdown options ================ */
    $(selector.listoptions).on('mouseover', function (e) {
        var $this = $(this);
        $(selector.listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
        $(selector.selectedOption).attr('id','');
        $this.addClass('highlighted').attr({'id':optionId,'tabindex':'0'});
        $this.focus();
    });
    $('body').on('mouseout','.dropdown', function (e) {
        $(selector.listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
        $customSelectElement.focus();
    });

    /* ============ Handle keydown of down arrow event on custom select =========== */
    $('body').on('keydown', selector.handle, function (e) {
        if (e.which === key.tab || e.keyCode === key.tab) {
            return;
        }
        e.preventDefault();
        var $this = $(this);
        if (e.which === key.down || e.keyCode === key.down) {
            $container.find('.selected').addClass('highlighted').attr({'id':optionId,'tabindex':'0'}).focus();
            $container.addClass('expanded');
        } else if (e.which === key.esc || e.keyCode === key.esc) {
            $container.removeClass('expanded');
            $(selector.listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $(selector.selectedOption).attr('id','');
            $customSelectElement.focus();
        }
    });

    /* =============== Handle keydown on custom select dropdown options ================ */
    $('body').on('keydown','.highlighted', function (e) {
        var $this = $(this);
        if (e.which === key.tab || e.keyCode === key.tab) {
            selectOption($this);
            closeDropdown();
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var $next = $this.next();
        var $prev = $this.prev();
        if ((e.which === key.down || e.keyCode === key.down) && $next.length > 0) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $next.addClass('highlighted').attr({'id':optionId,'tabindex':'0'}).focus();

        } else if ((e.which === key.up || e.keyCode === key.up) && $prev.length > 0) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $prev.addClass('highlighted').attr({'id':optionId,'tabindex':'0'}).focus();
        } else if (e.which === key.pagedown || e.keyCode === key.pagedown || e.which === key.end || e.keyCode === key.end) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $(selector.listoptions).last().addClass('highlighted').attr({'id':optionId,'tabindex':'0'}).focus();
        } else if (e.which === key.pageup || e.keyCode === key.pageup || e.which === key.home || key.keyCode === key.home) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $(selector.listoptions).first().addClass('highlighted').attr({'id':optionId,'tabindex':'0'}).focus();
        } else if (e.which === key.esc || e.keyCode === key.esc) {
            closeDropdown();
        } else if (e.which === key.enter || e.keyCode === key.enter || e.which === key.space || e.keyCode === key.space) {
            selectOption($this);
            closeDropdown();
        }
    });

    /* =============== Handle on click of a custom dropdown option =============== */
    $('body').on('click','.highlighted', function (e) {
        e.preventDefault();
        var $this = $(this);
        selectOption($this);
        closeDropdown();
    });

    /* =========== Focus custom select on click of html select's label =========== */
    $(selector.label).on('click', function (e) {
        e.preventDefault();
        $(selector.handle).focus();
    });

    /* ========== Reflect any changes on html select to the custom select ======== */
    $selectbox.on('change', function (e) {
        changeOption();
    });

    function selectOption ( $option ) {
        $(selector.container +' .selected').removeClass('selected').attr('aria-selected','false');
        $option.addClass('selected').attr('aria-selected','true');
        var selectedValue = $option.attr('data-value');
        $selectbox.val(selectedValue);
        $(selector.displayText).text($option.text());
        $customSelectElement.val($option.text());
        $(selector.hidden).val(selectedValue);
    }
    function closeDropdown() {
        $container.removeClass('expanded');
        $(selector.listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
        $customSelectElement.focus();
    }
    function changeOption () {
        if(!$container.hasClass('active')) {
            dataValue = $selectbox.val();
            $(selector.selected).removeClass('selected highlighted').attr('aria-selected','false');
            $(selector.listoptions+'[data-value="'+dataValue+'"]').addClass('selected').attr('aria-selected','true');
            textValue = $(selector.selected).text();
            $(selector.displayText).text(textValue);
            $customSelectElement.val(textValue);
            $(selector.hidden).val(dataValue);
        }
        return;
    } 
}
