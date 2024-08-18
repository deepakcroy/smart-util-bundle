;(function ( $ ) {
	var pluginName = 'sutilDialog';
	
	function Plugin(element, options) {
		var el = element; var $el = $(element);
		options = $.extend({}, $.fn[pluginName].defaults, options);
		/************************** Start Plugin Functionality**********************************************/
		//[basic=>"",scrollable=>modal-dialog-scrollable,centered=>modal-dialog-centered,xl=>modal-xl,large=>modal-lg,small=>modal-sm,fullscreen=>modal-dialog modal-fullscreen]
		const sizeMap = {
		    'basic': '',
		    'scrollable': 'modal-dialog-scrollable',
		    'centered': 'modal-dialog-centered',
		    'xl': 'modal-xl',
		    'large': 'modal-lg',
		    'small': 'modal-sm',
		    'fullscreen': 'modal-dialog modal-fullscreen'
		};
		function _initDialog()
		{

			var attrDlgId = $(el).attr('id');
			if (typeof attrDlgId !== typeof undefined && attrDlgId !== false) {
				var html=[];
				var dlg = $('<div class="modal fade sutil-modal">');
				var modalDlg = $('<div class="modal-dialog">');
				var modalContent = $('<div class="modal-content">');

				var modalHeader = $('<div class="modal-header">');
				
				var modalHeaderClose=$('<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="lni lni-close"></i></button>');
				var modalHeaderTitle=$('<h6 class="modal-title">' + options.title + '</h6>');
				
				var modalHeaderLoader=$('<img class="content-loader" src="' + options.loader + '" alt="loading..." />');
				
				var modalHeaderResponse=$('<span class="modal-response"></span>');				
				
				var modalHeaderCtrls = $('<div class="input-group sutil-modal-ctrlgrp">');
				
				if(options.hasMaximize){
					var modalHeaderMaximize=$('<button type="button" class="btn-maximize"><i class="bx bx-window"></i></button>');
					modalHeaderCtrls.append(modalHeaderMaximize).append(modalHeaderClose);
					
					modalHeaderMaximize.on("click",function(){
						var maxBtn = modalHeaderMaximize.find('.bx-window').length;
						
						if (maxBtn==1) {
							modalHeaderMaximize.find('.bx').eq(0).removeClass('bx-window').addClass('bx-windows');
							/*
							dlg.addClass("modal-fullscreen");
							dlg.css({top:0,left:0});
							*/
							modalDlg.addClass("modal-fullscreen");
							modalDlg.css({top:0,left:0});
						} else {
							modalHeaderMaximize.find('.bx').eq(0).removeClass('bx-windows').addClass('bx-window');
							modalDlg.removeClass("modal-fullscreen");
						}
							
					});
				}
				modalHeaderCtrls.append(modalHeaderClose);
				modalHeader.append(modalHeaderTitle).append(modalHeaderLoader).append(modalHeaderResponse).append(modalHeaderCtrls);
				
				var modalBody= $('<div class="modal-body">');

				var modalFooter= $('<div class="modal-footer">');

				if(options.animation!="")
					modalContent.addClass("animated ").addClass(options.animation);

				if(options.html.trim()!="")
					modalHeaderLoader.addClass("fade");
					
				if(options.isBackDropStatic)
					dlg.attr("data-bs-backdrop","static");

				if(options.isFooter){
					var saveBtn = "";
					if(options.saveButton)
					{
						saveBtn = $('<button type="submit" class="btn btn-success sutil-btn-submit">');
						saveBtn.text(options.saveButtonLabel);
	
						saveBtn.click(function(){
							options.onFormRequest();
						});
					}
					var cancelBtn = "";
					if(options.cancelButton)
					{
						cancelBtn = $('<button type="button" class="btn btn-primary close-modal sutil-btn-close" data-bs-dismiss="modal">');
						cancelBtn.text(options.cancelButtonLabel);
					}
					modalFooter.append(saveBtn).append(cancelBtn);
	
					modalContent.append(modalHeader).append(modalBody).append(modalFooter);
				} else {
					modalContent.append(modalHeader).append(modalBody);
				}
				
				modalDlg.append(modalContent);
				dlg.append(modalDlg);



				html.push(
					dlg
				);
				$el.html(html);

				dlg.modal('show');
				
				
				dlg.on('shown.bs.modal', function () {
					
					if(options.html.trim()!=""){
						modalBody.html(options.html);
						setTimeout(function () {							
								if(options.size.trim().toUpperCase()!="FULLSCREEN"){
									if(options.isDraggable){
										modalHeader.addClass('sutil-draggable');
										dlg.sutilDraggable({ handle: ".modal-header" });
									}
								}
							},200);
					} else {
						modalBody.load(options.url, function (data) {
							setTimeout(function () {
								options.onLoadCallback();
								modalHeaderLoader.hide();
	
								if(options.size.trim().toUpperCase()!="FULLSCREEN"){
									//make me draggable
									if(options.isDraggable){
										modalHeader.addClass('sutil-draggable');
										modalDlg.sutilDraggable({ handle: ".modal-header" });
									}
								}
							},200);
						});
					}
					

				}).modal();


				dlg.on('hidden.bs.modal', function () {
					destroy();
					dlg.remove();
					if (options.isRefreshOnClose==true) {
						location.reload();
					}
					options.onCloseCallback();
				});

				if (options.hideOverflow==true) {
					modalBody.css({ 'overflow': 'hidden' });
				}
				dlg.css({
					'z-index':options.zIndex
				});
				
				if(options.size!=""){
					modalDlg.addClass(sizeMap[options.size]);
				}
				else {
					modalBody.css({
						'overflow-y':'auto',
						'height':options.height,
						'min-height':options.minHeight,
						'max-height':options.maxHeight,
					});
					modalDlg.css({
						width: options.width,
						'max-width': options.maxWidth,
						height: options.height,
						'max-height': options.maxHeight,
					});
				}
			}
			else
			{
				alert("id attribute is not present");
			}


		}


		/************************** End Plugin Functionlity ************************************************/

		function init() {
			_initDialog();
			hook('onInit');
		}

		function option (key, val) {
			if (val) { options[key] = val; } else { return options[key]; }
		}
		function destroy() {
			$el.each(function() {
				var el = this;
				var $el = $(this);
				hook('onDestroy');
				$el.removeData('plugin_' + pluginName);
			});
		}
		function hook(hookName) {
			if (options[hookName] !== undefined) {
				options[hookName].call(el);
			}
		}
		init();
		return {
			option: option, // registering a public member
			destroy: destroy // registering a public method
		};
	}

	$.fn[pluginName] = function(options) {
		// For Showing and Hinding Loader: Start
		var el = $(this);
		var _showLoader = function() {
            el.find('.content-loader').show();
        };       
        var _hideLoader = function() {
            el.find('.content-loader').hide();
        };
        var settings = $.extend({
            showLoader: _showLoader,
            hideLoader: _hideLoader
        }, options);
        this.showLoader = function() {
            settings.showLoader.call(this);
        };
        this.hideLoader = function() {
            settings.hideLoader.call(this);
        };
        options = $.extend({}, settings);     	      
        // For Showing and Hinding Loader: End
                
		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);

			var returnVal;
			this.each(function() {
				if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
					returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
				} else {
					throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
				}
			});
			if (returnVal !== undefined){
				return returnVal;
			} else {
				return this;
			}
		} else if (typeof options === "object" || !options) {
			return this.each(function() {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		}
	};
	/**
	 * Default options initialization
	 */
	$.fn[pluginName].defaults = {
		wrapper: "sutil-modal-holdër",
		title: "Title",
		size:"", //[basic=>"",scrollable=>modal-dialog-scrollable,centered=>modal-dialog-centered,xl=>modal-xl,large=>modal-lg,small=>modal-sm,fullscreen=>modal-dialog modal-fullscreen]
		width:"auto",
		maxWidth:'100%',
		height:"auto",
		maxHeight: 500,
		minHeight:200,
		url:"./",
		html:"",
		hideOverflow:false,
		hasMaximize: false,
		isRefreshOnClose:false,
		isBackDropStatic:false, //freeze modal
		isDraggable:true,
		isFooter:true,
		loader: "./assets/plugins/smart-util-bundle/img/loading.gif",
		saveButton:true,
		saveButtonLabel:"Save",
		cancelButton:true,
		cancelButtonLabel:"Cancel",
		animation:"", // [flipInY,fadeInRight,bounceInRight,fadeIn ]
		zIndex:2050,
		onLoadCallback: function(){},
		onCloseCallback: function(){},
		onFormRequest: function(){},
	};
})(jQuery);


// other su-plugins
;(function ($) {
	
	//Draggable plugin: Start
	
    $.fn.sutilDraggable = function (options) {
        var settings = $.extend({ handle: 0, exclude: 0 }, options);

        return this.each(function () {
            var dx, dy, el = $(this), handle = settings.handle ? $(settings.handle, el) : el;
            handle.on({
                mousedown: function (e) {
                    if (settings.exclude && ~$.inArray(e.target, $(settings.exclude, el))) return;
                    e.preventDefault();
                    var os = el.offset();
                    dx = e.pageX - os.left;
                    dy = e.pageY - os.top;
                    $(document).on('mousemove.' + $.fn.sutilDraggable.pluginName, function (e) {
                        el.offset({ top: e.pageY - dy, left: e.pageX - dx });
                    });
                },
                mouseup: function (e) {
                    $(document).off('mousemove.' + $.fn.sutilDraggable.pluginName);
                }
            });
        });
    };    
    //draggable plugin: end 
    
    
    //dropable plugin: start
    $.fn.sutilDroppable = function (options) {
		var settings = $.extend({ accept: 0, onDrop: function () {} }, options);
        
        return this.each(function () {
            var el = $(this);
            el.on('mouseup', function (e) {
                var draggableElement = $(document.elementFromPoint(e.clientX, e.clientY));
                if (settings.accept && !draggableElement.is(settings.accept)) {
                    return;
                }
                settings.onDrop.call(el, draggableElement);
            });
        });
	};
    //dropable plugin: end
    
    // sutilMsgBox : Start   
    /**
	 * call:  $.fn.sutilMessageBox({'message':'This is a modal dialog, right?.'});
	 */
    $.fn.sutilMessageBox = function(options) {
		// Define default settings
		var settings = {
			title: 'Message Dialog',
			message:'',
			overlay:true,
			label:'Okay',
			click: function(){}
		};
		// merge options
		$.extend(settings, options);	
		
		var _overlay = settings.overlay ? 'sutil-overlay' : '';
		var _wrapper = $('<div class='+_overlay+'>');
		var _dlg = $('<div class="sutil-dialog-box">');
		
		var _header = $('<div class="sutil-dialog-box-header">');
		var _title = $('<h5>'+settings.title+'</h5>');
		_header.append(_title);
		
		var _content = $('<div class="sutil-dialog-box-content">');
		var _message = $('<p id="modalText">'+settings.message+'</p>');
		_content.append(_message);
		
		var _footer = $('<div class="sutil-dialog-box-footer">');
		var _cancel = $('<button class="btn btn-primary close-modal sutil-btn-close">'+settings.label+'</button>');
		_footer.append(_cancel);
		
		_dlg.append(_header).append(_content).append(_footer);
		_wrapper.append(_dlg);
		
		
		$('body').append(_wrapper);
		$(_wrapper).fadeIn();
		$(_cancel).on('click', function() {
			settings.click();
	        $(_wrapper).fadeOut(function() {
	            $(this).remove();
	        });
	    });	
	  };
	// sutilMessageBox : End
    
    // sutilConfirmBox : Start   
    /**
	 * call:  $.fn.sutilConfirmBox({'message':'This is a modal dialog, right?.'},function(result) {	
	      if (result) {
	        alert('Confirmed');
	      } else {
	        alert('Cancelled');
	      }
	    });
	 */	
	$.fn.sutilConfirmBox = function(options, callback) {
		// Define default settings
		var settings = {
			title: 'Confirm Dialog',
			message:'',
			overlay:true,
			labelY:'Yes',
			labelN:'No',
			click: function(){}
		};
		// merge options
		$.extend(settings, options);	
		
		var _overlay = settings.overlay ? 'sutil-overlay' : '';
		var _wrapper = $('<div class='+_overlay+'>');
		var _dlg = $('<div class="sutil-dialog-box">');
		
		var _header = $('<div class="sutil-dialog-box-header">');
		var _title = $('<h5>'+settings.title+'</h5>');
		_header.append(_title);
		
		var _content = $('<div class="sutil-dialog-box-content">');
		var _message = $('<p id="modalText">'+settings.message+'</p>');
		_content.append(_message);
		
		var _footer = $('<div class="sutil-dialog-box-footer">');
		var _yes = $('<button class="btn btn-primary">'+settings.labelY+'</button>');
		var _cancel = $('<button class="btn btn-primary">'+settings.labelN+'</button>');
		_footer.append(_yes).append(_cancel);
		
		_dlg.append(_header).append(_content).append(_footer);
		_wrapper.append(_dlg);
				
		$('body').append(_wrapper);		
		$(_wrapper).fadeIn();	
	
	    $(_yes).off().on('click', function() {
	      callback(true);
	      $(_wrapper).fadeOut();
	    });
	
	    $(_cancel).off().on('click', function() {
	      callback(false);
	      $(_wrapper).fadeOut();
	    });		
	  };	
	// sutilConfirmBox : End
	
    // context-menu : Start
	$.fn.sutilContextMenu = function(options) {
		// Define default settings
		var settings = {
			contextMenuClass: 'sutil-context-menu',
			linkClickerClass: 'contextMenuLink',
			gutterLineClass: 'gutterLine',
			headerClass: 'header',
			seperatorClass: 'divider',
			title: '',
			items: []
		};

		// merge options
		$.extend(settings, options);
		
		// Build context menu with HTML
		function createMenu(e) {
			var menu = $('<ul class="' + settings.contextMenuClass + '"><div class="' + settings.gutterLineClass + '"></div></ul>')
				.appendTo(document.body);
			if (settings.title) {
				$('<li class="' + settings.headerClass + '"></li>').text(settings.title).appendTo(menu);
			}
			settings.items.forEach(function(item) {
				if (item) {
					var rowCode = '<li><a href="#" class="' + settings.linkClickerClass + '"><span class="itemTitle"></span></a></li>';
					var row = $(rowCode).appendTo(menu);
					if (item.icon) {
						var icon = $('<img>');
						icon.attr('src', item.icon);
						icon.insertBefore(row.find('.itemTitle'));
					}
					if (item.iconClass) {
						var i = $('<i>');
						i.attr('class', item.iconClass);
						i.insertBefore(row.find('.itemTitle'));
					}
					row.find('.itemTitle').text(item.label);

					if (item.isEnabled != undefined && !item.isEnabled()) {
						row.addClass('disabled');
					} else if (item.action) {
						row.find('.' + settings.linkClickerClass).click(function() { item.action(e); });
					}
				} else {
					$('<li class="' + settings.seperatorClass + '"></li>').appendTo(menu);
				}
			});
			menu.find('.' + settings.headerClass).text(settings.title);
			return menu;
		}
		
		// On right click fire contextmenu event
		this.on('contextmenu', function(e) {
			var menu = createMenu(e)
				.show();
			var left = e.pageX + 5,
				top = e.pageY;
			if (top + menu.height() >= $(window).height()) {
				top -= menu.height();
			}
			if (left + menu.width() >= $(window).width()) {
				left -= menu.width();
			}
			// Create and show menu
			menu.css({ zIndex: 1000001, left: left, top: top })
				.on('contextmenu', function() { return false; });

			// Cover rest of page with invisible div that when clicked will cancel the popup.
			var bg = $('<div></div>')
				.css({ left: 0, top: 0, width: '100%', height: '100%', position: 'absolute', zIndex: 1000000 })
				.appendTo(document.body)
				.on('contextmenu click', function() {
					// If click or right click anywhere else on page: remove clean up.
					bg.remove();
					menu.remove();
					return false;
				});

			// When clicking on a link in menu: clean up (in addition to handlers on link already)
			menu.find('a').click(function() {
				bg.remove();
				menu.remove();
			});

			// Cancel event, so real browser popup doesn't appear.
			return false;
		});

		return this;

	};    
    // context menu : end
    
}(jQuery));

//sutilValidate : Start *********************************************************
;(function($) {
	
	/**
	 * Plugin: sutilInputSanitizer
	 * Applied on all input/textarea elemnts of wrapper container
	 * Call Example: 
	 * Call Without Argument: $("#myElementWrapper").sutilInputSanitizer();
	 * Call With Argument: $("#myElementWrapper").sutilInputSanitizer({excludes:['digit','number']});
	 */
	$.fn.sutilInputSanitizer = function(options) {
		var settings = {
			excludes:[] // text, digit, number, alphanumeric
		};
		// merge options
		$.extend(settings, options);

		return this.each(function() {
			var elements = $(this).find('input, textarea');

			elements.on('keypress', function(event) {
				var keyCode = event.which || event.keyCode;
				var key = event.key;				
				//var char = String.fromCharCode(keyCode);
				
				//console.log(keyCode+':'+key);
				// Check if the element has the respective data attribute
				var dataType = $(this).data('alphanumeric') !== undefined ? 'alphanumeric' :
                         $(this).data('number') !== undefined ? 'number' :
                         $(this).data('text') !== undefined ? 'text' :
                         $(this).data('digit') !== undefined ? 'digit' :
                         $(this).data('phone') !== undefined ? 'phone' : null;
				
				//console.log(dataType);
				if(settings.excludes.includes(dataType))
					dataType = null;
					
				if (dataType) {
					// Allow alphanumeric characters, numbers, or letters
					if (
						!(
							(dataType === 'text' && (
								(keyCode >= 65 && keyCode <= 90) || // Uppercase letters
								(keyCode >= 97 && keyCode <= 122)|| // Lowercase letters
								 keyCode === 32 // Space
							)) ||
							(dataType === 'digit' && (
								(keyCode >= 48 && keyCode <= 57) || // Digits
								keyCode === 45 // Minus sign
							)) ||
							(dataType === 'number' && (
								(keyCode >= 48 && keyCode <= 57) || // Digits
								keyCode === 45 || // Minus sign
								keyCode === 46 // Decimal point
							)) ||
							(dataType === 'phone' && (
								(keyCode >= 48 && keyCode <= 57) || // 0 to 9
								keyCode === 43 || keyCode === 45 || // + and -
        						(event.shiftKey && keyCode === 61)
							)) ||
							/*(dataType === 'phone' && (
								/[\d+\-]/.test(char) || // 0-9, +, -
        						(key === '+')        						
							)) ||*/
							(dataType === 'alphanumeric' && (
								(keyCode >= 48 && keyCode <= 57) || // Digits
								(keyCode >= 65 && keyCode <= 90) || // Uppercase letters
								(keyCode >= 97 && keyCode <= 122)   // Lowercase letters
							))
						) && keyCode !== 8 && keyCode !== 46 // Backspace and Delete
					) {
						//console.log(event.shiftKey+': y');
						event.preventDefault();
					}
				}
			});
		});

	};    
    // sutilInputSanitizer: End **********************************************
    
	/**
	 * Plugin: sutilValidate
	 * Call Example: 
	 * Call Without Argument: $("#myElement").sutilValidate('validateEmail');
	 * Call With Argument: $("#myElement").sutilValidate('validateEmail','testArgument');
	 */
	$.fn.sutilValidate = function(method, ...args) {
		if (sutilValidate[method]) {
			//return sutilValidate[method].apply(this, Array.prototype.slice.call(arguments, 1));
			return sutilValidate[method].apply(this, args);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.sutilValidate');
		}
	};
	var sutilValidate = {		
		validateEmail: function(customArg) {
			let errMsg = '';
			this.each(function() {
				let email = $(this).val();
				let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(email)) {
					 //errMsg='Invalid email address! Custom argument: ' + customArg;
					 errMsg='Invalid email address!';
				}
			});
			return errMsg;
		},
		validateIPAddress: function() {
			let errMsg = '';
			this.each(function() {
				let ipAddress = $(this).val();
				let ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?:[0-9a-fA-F]{1,4}:){1,6})|:((?:[0-9a-fA-F]{1,4}:){1,6})?)\b)(?:\d{1,5})?\b$/;
				if (!ipRegex.test(ipAddress)) {
					errMsg='Invalid IP address!';
				}
			});
			return errMsg;
		},
		validateDateOfBirth: function() {
			let errMsg = '';
			this.each(function() {
				let dateOfBirth = $(this).val();
				let dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
				if (!dateRegex.test(dateOfBirth)) {
					errMsg='Invalid date of birth! Please use the format MM/DD/YYYY.';
				}
			});
			return errMsg;
		},
		validateURL: function() {
			let errMsg = '';
			this.each(function() {
				let url = $(this).val();
				let urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
				if (!urlRegex.test(url)) {
					errMsg='Invalid URL!';
				}
			});
			return errMsg;
		},
		validateAge: function() {
			let errMsg = '';
			this.each(function() {
				let age = parseInt($(this).val(), 10);
				if (isNaN(age) || age < 0 || age > 150) {
					errMsg='Invalid age! Please enter a valid age.';
				}
			});
			return errMsg;
		},
		validateDigits: function() {
			let errMsg = '';
			this.each(function() {
				let value = $(this).val();
				let digitsRegex = /^\d+$/;
				if (!digitsRegex.test(value)) {
					errMsg='Invalid digits! Please enter only numeric values.';
				}
			});
			return errMsg;
		},
		validatePositiveNumber: function() {
			let errMsg = '';
			this.each(function() {
				let number = parseFloat($(this).val());
				if (isNaN(number) || number <= 0) {
					errMsg='Invalid positive number! Please enter a positive numeric value.';
				}
			});
			return errMsg;
		},
		validateUserID: function() {
			let errMsg = '';
			this.each(function() {
				let userID = $(this).val();
				let userIDRegex = /^[a-zA-Z0-9_-]+$/;
				if (!userIDRegex.test(userID)) {
					errMsg='Invalid user ID! Please use only alphanumeric characters, hyphens, and underscores.';
				}
			});
			return errMsg;
		},
		validatePassword: function() {
			let errMsg = '';
			this.each(function() {
				let password = $(this).val();
				if (password.length < 8) {
					errMsg='Invalid password! Password must be at least 8 characters.';
				}
			});
			return errMsg;
		}
	};
	
	/**
	 * Plugin: sutilValidateForm
	 * Call Example: 
	 * Call Without Argument: $("#myForm").sutilValidateForm();
	 */
	$.fn.sutilValidateForm = function(options) {
        // Default options
        var settings = $.extend({
            errorClass: 'sutil-error',
            errorMessage: 'This field is required'
        }, options);
        
        var isValid = true;
        
        this.each(function() {
            var $form = $(this);
            // Iterate over each form element with the 'required' attribute
            $form.find('[required]').each(function() {
                var $input = $(this);
				
                // Check if the field is empty
                if ($input.val().trim() === '') {
                    isValid = false;

					if(!$input.hasClass(settings.errorClass)){
						// Add error class and display error message
                        $input.addClass(settings.errorClass);
                        $input.after('<span class="sutil-error-message">' + settings.errorMessage + '</span>');	
					}                        
                } else {
                    // Remove error class and error message if field is not empty
                    $input.removeClass(settings.errorClass);
                    $input.siblings('.sutil-error-message').remove();
                }
            });
            
            $form.find('input, select, textarea').each(function() {
				 var $input = $(this);
				 $input.on("blur",function(){
					if($(this).val()===''){
						if(!$(this).hasClass(settings.errorClass)){
							$input.addClass(settings.errorClass);
                        	$input.after('<span class="sutil-error-message">' + settings.errorMessage + '</span>');	
						}
					} 
					else 
					{
						$input.removeClass(settings.errorClass);
                    	$input.siblings('.sutil-error-message').remove();
                    		
						var dataType = $(this).data('alphanumeric') !== undefined ? 'alphanumeric' :
                         $(this).data('number') !== undefined ? 'number' :
                         $(this).data('text') !== undefined ? 'text' :
                         $(this).data('digit') !== undefined ? 'digit' :
                         $(this).data('phone') !== undefined ? 'phone' : 
                         $(this).data('email') !== undefined ? 'email' : null;
                        var _errMsg='';
                        //console.log(dataType);
                        if(dataType==='email')
                        {
							_errMsg = $(this).sutilValidate('validateEmail');
							//console.log(_errMsg);
							if(_errMsg!==''){
								$input.addClass(settings.errorClass);
                        		$input.after('<span class="sutil-error-message">' + _errMsg + '</span>');
							}
						} 
						
					}
				});
			});
        });
        return isValid;
    };
})(jQuery);
//sutilValidate :end ************************************************************
