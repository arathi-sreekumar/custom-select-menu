$(function() {    
    /*
        IE7 and below disable supported. Fallback to html select
        This will be required if you need proper accessibility in ie7
        If accessibility is not an issue this feature neednt be turned on
    */
    // if (navigator.appVersion.indexOf("MSIE 7.") != -1){ //test for MSIE x.x;
    //     var ieversion = new Number(RegExp.$1); // capture x.x portion and store as a number
    //     if (ieversion<=7) {
    //         return;
    //     }
    // }

    function CustomSelect (el, opts) {
        this.selectbox = el instanceof $ ? el : $(el);
        this.selectAttributes();
        this.makeSelectors(this.select.id);
        this.initialize();

        if (!this.select.isDisabled) {

            $('body').on('click', this.uiBox, { container: this.container }, this.displayClickHandler);

            $('body').on('click', { container: this.container, listoptions: this.listoptions }, this.clickOutHandler);

            $('body').on('focus', this.handle + ' ,' + this.listoptions, { container: this.container }, this.focusHandler);

            $('body').on('blur', this.handle + ', '+ this.listoptions, { container: this.container, containerId: this.containerId, customSelectElement: this.customSelectElement }, this.blurHandler);

            $('body').on('mouseover', this.listoptions, { listoptions: this.listoptions, selectedOption: this.selectedOption, optionId: this.optionId }, this.mouseOverHandler);

            $('body').on('mouseout',this.containerId + ' .dropdown', { listoptions: this.listoptions, customSelectElement: this.customSelectElement }, this.mouseOutHandler);

            $('body').on('keydown', this.handle, {container: this.container, optionId: this.optionId, listoptions: this.listoptions, selectedOption: this.selectedOption, customSelectElement: this.customSelectElement}, this.displayKeyDownHandler);

            $('body').on('keydown', this.containerId + ' .highlighted', { selectObj: this }, this.selectItemKeydownHandler);

            $('body').on('click', this.containerId + ' .highlighted', { selectObj: this }, this.selectItemClickHandler);

            $('body').on('click', this.label, { handle: this.handle }, this.selectLabelClickHandler);

            $('body').on('change', '#' + this.select.id + '-old', { selectObj: this }, this.htmlSelectChangeHandler);
        } else {
            $('body').on('click', this.uiBox, function (e) { e.preventDefault(); });
        }
    }

    //var $selectbox = $(this);

    // var select = new selectAttributes();         //represents html select as an object
    // var selector = new makeSelectors(select.id); // object that holds various css selectors for custom select

    CustomSelect.prototype.initialize = function () {

    /*  ===== if existing already remove exiting instance of this custom select in order to create fresh instance ====== */
        if ($(this.containerId).length) {
            $(this.containerId).remove();
        }

    /* ================ Creating DOM structure for the custom dropdown options section ================== */
        var selectDropDownDOM = '<ul class="dropdown" role="listbox" aria-live="polite" aria-expanded="true">';
            var customObj = this;
            this.select.options.each(function (option) {

                selectDropDownDOM += '<li role="option" data-option-array-index="'+ (option + 1) +'" data-value="' + $(this).val() + '"';
                if ($(this).is(':selected')) {

                    selectDropDownDOM+= ' aria-selected="true" class="highlighted selected" id="'+customObj.select.id+'-option"';
                    customObj.select.displayText = $(this).text();
                } else {
                    selectDropDownDOM+= ' aria-selected="false"';
                }
                selectDropDownDOM += '>' + $(this).text() + '</li>';
            });
            selectDropDownDOM += '</ul>';

    /* ========================================== Creating DOM structure for custom select ===================================== */

    var customSelectDOM = '';
    if (!this.select.isDisabled) {
            customSelectDOM  = '<div class="custom-select-container" id="custom-' + this.select.id + '-container">';
            customSelectDOM += '<input type="hidden" id="' + this.select.id + '" name="' + this.select.name + '" value="' + this.select.value + '" class="custom-select-input-fields custom-select-val-field"/>';
            customSelectDOM += '<input type="text" value="' + this.select.displayText + '" tabindex="0" class="custom-select-input-fields custom-select-input" id="custom-'+this.select.id+'" role="combobox" aria-autocomplete="listbox" aria-labelledby="' + this.select.id + '-label" aria-activedescendant="' + this.select.id + '-option" />';
            customSelectDOM += '<a tabindex="-1" class="custom-select-display"><span class="custom-select-display-text">' + this.select.displayText + '</span><div class="custom-select-btn-outer"><b class="custom-select-btn"></b></div></a>';
            customSelectDOM += selectDropDownDOM;
            customSelectDOM +='</div>';
    } else {
            customSelectDOM  = '<div class="custom-select-container" id="custom-' + this.select.id + '-container">';
            customSelectDOM += '<a tabindex="-1" class="custom-select-display disabled"><span class="custom-select-display-text">' + this.select.displayText + '</span><div class="custom-select-btn-outer"><b class="custom-select-btn"></b></div></a>';
            customSelectDOM +='</div>';
    }

    /* ===================================  Adding custom select into the html dom structure ==================================== */
        this.selectbox.next('.custom-select-filler').remove();
        this.selectbox.after(customSelectDOM);
        this.selectbox.attr('disabled','disabled').attr('id', this.select.id + '-old');

    /* ======================= Creating jquery handles to the container and custom selectbox focus elements ======================= */
        this.container = $(this.containerId);
        this.customSelectElement = $(this.handle);
        this.container.width(this.select.width);
        this.optionId = this.select.id + '-option';        //used for aria active descendant tracking purpose of current option
    };

    /* ======================== Class function to create an object consisting of all select attributes ============================ */
    CustomSelect.prototype.selectAttributes = function () {
        var $selectbox = this.selectbox;
        this.select = {
            width: $selectbox.outerWidth(),
            options: $selectbox.children(),
            value: $selectbox.val(),
            name: $selectbox.attr('name'),
            id: $selectbox.attr('id'),
            displayText: 'Select',
            isDisabled: $selectbox.attr('disabled')
        };

    };

    /* =============== Class function to create an object consisting of all css selectors required for custom select ============= */
    CustomSelect.prototype.makeSelectors = function (id) {

        this.containerId      = '#custom-' + id + '-container';
        this.selectedOption = '#' + id + '-option';
        this.hidden         = this.containerId + ' .custom-select-val-field';
        this.uiBox        = this.containerId + ' .custom-select-display';
        this.handle         = this.containerId + ' .custom-select-input';
        this.displayText           = this.containerId + ' .custom-select-display span';
        this.listoptions        = this.containerId + ' .dropdown li';
        this.selected       = this.containerId + ' .selected';
        this.label          = 'label[for="' + id + '"]';
    };

    /* ================ key code handling function class - for better readability - stores all keycodes by name ================ */
    function KeyCodes() {
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
    var key = new KeyCodes();
    // End key code handling

    /* =========== Handle click event on custom selectbox  ================ */
    //On click toggle dropdown display
    CustomSelect.prototype.displayClickHandler = function (e) {
        e.preventDefault();
        var $container = e.data.container;
        var $this = $(this);
        if(!$container.hasClass('expanded')) {
            $container.addClass('expanded');
            $container.find('.selected').addClass('highlighted').attr('tabindex',0).focus();
        } else {
            $container.removeClass('expanded');
            $this.focus();
        }
    };

    CustomSelect.prototype.clickOutHandler = function (e) {
        var $container = e.data.container;
        var listoptions = e.data.listoptions;
        if ($(e.target).parents().index($container) === -1) {
            $container.removeClass('expanded');
            $(listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
        }
    };

    /* ============ Handling focus of custom select box/ options ============== */
    CustomSelect.prototype.focusHandler = function (e) {
        var $container = e.data.container;
        $container.addClass('active');
    };

    CustomSelect.prototype.blurHandler = function (e) {
        var $container = e.data.container;
        var containerId = e.data.containerId;
        var $customSelectElement = e.data.customSelectElement;
        if(!$(containerId + ' .dropdown li').is(':focus') && !$customSelectElement.is(':focus')) {
            $container.removeClass('active');
        }
    };

    /* ================ Handle mouse events on dropdown options ================ */
    CustomSelect.prototype.mouseOverHandler = function (e) {
        var $this = $(this);
        var listoptions = e.data.listoptions;
        var selectedOption = e.data.selectedOption;
        var optionId = e.data.optionId;
        $(listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
        $(selectedOption).attr('id','');
        $this.addClass('highlighted').attr({'id':optionId,'tabindex':'0'});
        $this.focus();
    };

    CustomSelect.prototype.mouseOutHandler = function (e) {
        var listoptions = e.data.listoptions;
        var $customSelectElement = e.data.customSelectElement;
        $(listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
    };

    /* ============ Handle keydown of down arrow event on custom select =========== */
    CustomSelect.prototype.displayKeyDownHandler = function (e) {
        var $container = e.data.container;
        var optionId = e.data.optionId;
        var listoptions = e.data.listoptions;
        var selectedOption = e.data.selectedOption;
        var $customSelectElement = e.data.customSelectElement;

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
            $(listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $(selectedOption).attr('id','');
            $customSelectElement.focus();
        }
    };

    /* =============== Handle keydown on custom select dropdown options ================ */
    CustomSelect.prototype.selectItemKeydownHandler = function (e) {
        var selectObj = e.data.selectObj;

        var $this = $(this);
        e.stopPropagation();
        if (e.which === key.tab || e.keyCode === key.tab) {
            selectObj.selectOption($this);
            selectObj.closeDropdown();
            return;
        }
        e.preventDefault();
        var $next = $this.next();
        var $prev = $this.prev();
        if ((e.which === key.down || e.keyCode === key.down) && $next.length > 0) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $next.addClass('highlighted').attr({'id':selectObj.optionId,'tabindex':'0'}).focus();

        } else if ((e.which === key.up || e.keyCode === key.up) && $prev.length > 0) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $prev.addClass('highlighted').attr({'id':selectObj.optionId,'tabindex':'0'}).focus();
        } else if (e.which === key.pagedown || e.keyCode === key.pagedown || e.which === key.end || e.keyCode === key.end) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $(selectObj.listoptions).last().addClass('highlighted').attr({'id':selectObj.optionId,'tabindex':'0'}).focus();
        } else if (e.which === key.pageup || e.keyCode === key.pageup || e.which === key.home || key.keyCode === key.home) {
            $this.removeClass('highlighted').attr({'id':'','tabindex':'-1'});
            $(selectObj.listoptions).first().addClass('highlighted').attr({'id':selectObj.optionId,'tabindex':'0'}).focus();
        } else if (e.which === key.esc || e.keyCode === key.esc) {
            selectObj.closeDropdown();
        } else if (e.which === key.enter || e.keyCode === key.enter || e.which === key.space || e.keyCode === key.space) {
            selectObj.selectOption($this);
            selectObj.closeDropdown();
        }
    };

    /* =============== Handle on click of a custom dropdown option =============== */
    CustomSelect.prototype.selectItemClickHandler = function (e) {
        e.preventDefault();
        var $this = $(this);
        var selectObj = e.data.selectObj;
        selectObj.selectOption($this);
        selectObj.closeDropdown();
    };

    /* =========== Focus custom select on click of html select's label =========== */
    CustomSelect.prototype.selectLabelClickHandler = function (e) {
        var handle = e.data.handle;
        e.preventDefault();
        $(handle).focus();
    };

    /* ========== Reflect any changes on html select to the custom select ======== */
    CustomSelect.prototype.htmlSelectChangeHandler = function (e) {
        var selectObj = e.data.selectObj;
        selectObj.changeOption(selectObj);
    };

    CustomSelect.prototype.selectOption = function ( $option ) {
        $(this.containerId +' .selected').removeClass('selected').attr('aria-selected','false');
        $option.addClass('selected').attr('aria-selected','true');
        var selectedValue = $option.attr('data-value');
        this.selectbox.val(selectedValue);
        $(this.displayText).text($option.text());
        $(this.hidden).val(selectedValue);
        $(this.handle).val($option.text());
        this.customSelectElement.val($option.text());
        $(this.hidden).change();
    };
    CustomSelect.prototype.closeDropdown = function () {
        this.container.removeClass('expanded');
        $(this.listoptions).removeClass('highlighted').attr({'id':'','tabindex':'-1'});
        this.customSelectElement.focus();
    };
    CustomSelect.prototype.changeOption = function (selectObj) {
        if(!this.container.hasClass('active')) {
            dataValue = selectObj.val();
            $(this.selected).removeClass('selected highlighted').attr('aria-selected','false');
            $(this.listoptions+'[data-value="'+dataValue+'"]').addClass('selected').attr('aria-selected','true');
            textValue = $(this.selector.selected).text();
            $(this.displayText).text(textValue);
            $(this.handle).val(textValue);
            this.customSelectElement.val(textValue);
            $(this.hidden).val(dataValue);
        }
        return;
    };
});
