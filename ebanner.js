(function ( $ ) {

	var pluginName = 'ebanner';

	$.ebanner = function( element, options ) {
		
		this.element = element;
        this._name = pluginName;
		this._flag = 1;
		
		this.settings = $.extend({}, $.fn.ebanner.defaults, options);
		
		this.init();
		
	}
	
	
	$.extend($.ebanner.prototype, {
      
        init: function () {
           
            this.buildCache();
			this.buildCoords();
			this.buildDom();
            this.bindEvents();
			
        },

        // Remove plugin instance completely
        destroy: function() {            
            this.unbindEvents();
            this.$element.removeData();
        },

        // Cache DOM nodes for performance
        buildCache: function () {           
            this.$element = $(this.element);
        },
		
		 // build logics
        buildCoords: function () { 
		
			var plugin = this;			
			plugin.item_count = plugin.$element.find('li').length;
			plugin.step = plugin.$element.find('li').first().outerWidth();
			
			plugin.$element.find('li').each(function( index ){
				$(this).attr('data-index', index).css({
					'position' : 'absolute',				
					'z-index' : plugin.item_count - index,
					
				});	
			});
			if(plugin.item_count > 1)
				this.setPosition(plugin.setFlag());
			
	
        },
		
		// Create elements
        buildDom: function () { 		
			var plugin = this;			
			plugin.$element.append('<span class="ebanner_btn '+this.settings.leftBtn+'"></span><span class="'+this.settings.rightBtn+'"></span>');			
        },

        // Bind events that trigger methods
        bindEvents: function() {
            var plugin = this;  
			if(plugin.item_count > 1){					
				plugin.$element.on('click','.'+this.settings.rightBtn, function() {              
					plugin.goRight.call(plugin);							
				});
				plugin.$element.on('click','.'+this.settings.leftBtn, function() {              
					plugin.goLeft.call(plugin);							
				});		
			}			
        },
  
        unbindEvents: function() {           
            this.$element.off('.'+this._name);			
        },
  
        goRight: function() {
			var plugin = this;	
			if(plugin._flag == 1){
				plugin._flag = 0;	
				plugin.$element.find('li').each(function( index ){
					$index = parseInt($(this).attr('data-index')) + 1;
					if(plugin.item_count == $index)
						$index = 0;
					$(this).attr('data-index', $index);
				});
				this.setPosition(plugin.setFlag());
			}
        },
		
		goLeft: function() {
			var plugin = this;	
			if(plugin._flag == 1){
				plugin._flag = 0;	
				plugin.$element.find('li').each(function( index ){
					$index = parseInt($(this).attr('data-index')) - 1;
					if($index == -1)
						$index = plugin.item_count - 1;
					$(this).attr('data-index', $index);
				});
				this.setPosition(plugin.setFlag(), true);
			}
        },
		
		setPosition: function(callback, flag_left) {
			flag_left = flag_left || false;
			
			var plugin = this;	
			var position = plugin.settings.marginLeft;
			var step = 0;
			var element_length;
			plugin.$element.find('li').each(function( ){	
				index = parseInt($(this).attr('data-index'));				
				element_length = $(this).outerWidth();
				if(flag_left === false || index==0)
					$(this).css({										
						'z-index' : plugin.item_count - index	
					});	
				else{
					$(this).css({										
						'z-index' : index	
					});	
				}
					
				position = plugin.calcPosition(position, index, $(this));			
				$(this).animate({					
					'left' : position,	
					
				}, 500);				
								
			});	
        },		
		calcPosition: function(position, index, element) {
			var plugin = this;
			position = plugin.settings.marginLeft;
			if(index != 0 && index != 1 && index != (plugin.item_count-1)){				
				var angle = (180 - (plugin.item_count-2)/plugin.item_count * 180)/2 + 360/plugin.item_count*(index-1)/index;				
				radians = angle * Math.PI / 180; 				
				position = position + Math.floor(Math.cos(radians)*plugin.step);			
			}else{
				if(index == 1)
					position = position + plugin.step;
				if(index == (plugin.item_count-1))
					position = position - element.outerWidth();		
			}
			return position;
		},
		setFlag: function () {
			this._flag = 1;			
		}
    });
	
	
		
	$.fn.ebanner = function( options ) {

		this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                /*
                    Use "$.data" to save each instance of the plugin in case
                    the user wants to modify it. Using "$.data" in this way
                    ensures the data is removed when the DOM element(s) are
                    removed via jQuery methods, as well as when the userleaves
                    the page. It's a smart way to prevent memory leaks.

                */
                $.data( this, "plugin_" + pluginName, new $.ebanner(this, options) );
            }
        });
        
        return this;
	
	};
	
	$.fn.ebanner.defaults = {
		leftBtn: 'leftBtn',
		rightBtn: 'rightBtn',
		marginLeft: 100,		
    };
	
}( jQuery ));