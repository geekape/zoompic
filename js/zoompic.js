/**
 * ZoomPhoto
 * A jQuery plugin for simple lightboxes with zoom effect.
 *
 * (c) 2019 geekape - MIT
 */


// 基本思路
// 1. 遍历所有图片，设置类名，加事件
// 2. 判断放大还是缩小，分别执行对应的方法
// 3. 图片放大，计算图片位置，添加放大动画，同时添加遮罩
// 4. 图片缩小，删除相应的类，删除遮罩，还原位置


;(function($) {
	var Zoompic = function(element, options) {
		var that = this;
		
		this.$image = $(element).addClass('zoompic'); //取当前图片
		this.$shadow = null; //遮罩
		this._zoomed = false; //是否放大
		
		this.$image.on('click', function(){ that.zoom(); }) //添加事件
	}
	
	Zoompic.prototype.zoom = function() {
		console.log(this._zoomed)
		// 判断是否放大
		if (this._zoomed) this.zoomOut();
		else this.zoomIn();
	}
	
	Zoompic.prototype.zoomIn = function() {
		// 计算图片位置
		var offset     = this.$image.offset(),
			width      = this.$image.outerWidth(),
			height     = this.$image.outerHeight(),
			nWidth     = this.$image[0].naturalWidth || +Infinity,
			nHeight    = this.$image[0].naturalHeight || +Infinity,
			wWidth     = $(window).width(),
			wHeight    = $(window).height(),
			scaleX     = Math.min(nWidth, wWidth * 0.9) / width,
			scaleY     = Math.min(nHeight, wHeight * 0.9) / height,
			scale      = Math.min(scaleX, scaleY),
			translateX = (-offset.left + (wWidth - width) / 2) / scale,
			translateY = (-offset.top + (wHeight - height) / 2 + $(document).scrollTop()) / scale;
			
			this.$image.css({
				'transform': 'scale(' + scale +') translate(' + translateX + 'px, ' + translateY + 'px)'
			})
			this.$image.addClass('zoomed');
			this.addShadow();
			this._zoomed = true;
	}
	
	// 缩小图片
	Zoompic.prototype.zoomOut = function() {
		this._zoomed = false;
		this.$image.css({
			'transform': 'scale(1) translate(0,0)'
		})
		this.$image.removeClass('zoomed');
		this.removeShadow();
	}
	
	// 添加遮罩
	Zoompic.prototype.addShadow = function() {
		var that = this;
		
		if(this.$shadow) this.$shadow.remove();
		this.$shadow = $('<div class="zoompic-shadow"></div>');
		
		this.$shadow.addClass('zoomed');
		$('body').append(this.$shadow);
		this.$shadow.on('click', function () { that.zoomOut(); })
	}
	
	Zoompic.prototype.removeShadow = function() {
		if (!this.$shadow) return;
		this.$shadow.removeClass('zoomed');
		this.$shadow.remove();
	}



	$.fn.zoompic = function(options) {
		return this.each(function() {
			// 遍历图片
			var zoompic = new Zoompic(this, options);
		})
	}

})(jQuery);