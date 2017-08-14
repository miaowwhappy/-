;(function($){


 var Carousel = function(poster){   
    var that = this;
 	this.poster = poster;
    this.posterItemMain = poster.find("ul.poster-list");
    this.prevBtn = poster.find("div.poster-prev-btn");
    this.nextBtn = poster.find("div.poster-next-btn");
    this.posterItems = poster.find("li.poster-item");
/*    if(this.posterItems.length % 2 == 0){
        this.posterItemsMain.append(this.posterItems.eq(0).clone());
        this.posterItems = this.posterItemMain.children();
    }*/
    var n = this.posterItems.length;
    if(n%2 == 0){

            this.posterItems.eq(n/2).after(this.posterItems.eq(0).clone());

            this.posterItems = this.posterItemMain.children();
    };
    this.posterFirstItem = this.posterItems.eq(0);
    this.posterLastItem = this.posterItems.last();

    this.rotateFlag = true;
    

    this.setting = {
                     "width":1000,
					 "height":270,
					 "posterWidth":640,
					 "posterHeight":270,
					 "scale":0.9,
					 "speed":500,
					 "verticalAlign":"middle"	                                                       
                   };

    $.extend(this.setting,this.getSetting());

    this.setSettingVal();
    this.setPostersPos();
    this.setVerticalAlign();

    this.nextBtn.click(function(){
        if(that.rotateFlag){
            that.carouselRotate("left");
            that.rotateFlag = false;
        }
    });
    this.prevBtn.click(function(){
         if(that.rotateFlag){
            that.rotateFlag = false;
            that.carouselRotate("right");           
        }
    });
    if(this.setting.autoPlay){
        this.autoPlay();
        this.poster.hover(function(){
                              window.clearInterval(that.Timer);
                          },function(){
                              that.autoPlay();
                          })
    }
    
    
 }
 Carousel.prototype = {
    autoPlay:function(){
        var that = this;
        this.Timer = window.setInterval(function(){
            that.nextBtn.click();

        },this.setting.delay);
    },
    carouselRotate:function(dir){
        var that = this;
        var zIndexArr = [];
        if(dir === "left"){
            this.posterItems.each(function(){
                var self = $(this), 
                    prev = self.prev().get(0)?self.prev():that.posterLastItem,
                    width = prev.width(),
                    height = prev.height(),
                    zIndex = prev.css("zIndex"),
                    opacity = prev.css("opacity"),
                    left = prev.css("left"),
                    top = prev.css("top");
                    zIndexArr.push(zIndex);
                 self.animate({
                               width:width,
                               height:height,
                               zIndex:zIndex,
                               left:left,
                               top:top,
                               opacity:opacity
                              },that.setting.speed,function(){
                                that.rotateFlag = true;
                              });

            });
            this.posterItems.each(function(i){
                $(this).css("zIndex",zIndexArr[i])
            });


        }else if(dir ==="right"){
            this.posterItems.each(function(){
                var self = $(this), 
                    next = self.next().get(0)?self.next():that.posterFirstItem,
                    width = next.width(),
                    height = next.height(),
                    zIndex = next.css("zIndex"),
                    opacity = next.css("opacity"),
                    left = next.css("left"),                    
                    top = next.css("top");
                    zIndexArr.push(zIndex);
                 self.animate({
                               width:width,
                               height:height,
                               zIndex:zIndex,
                               left:left,
                               top:top,
                               opacity:opacity
                              },that.setting.speed,function(){
                                that.rotateFlag = true;
                              })


            });
            this.posterItems.each(function(i){
                $(this).css("zIndex",zIndexArr[i])
            });


        }
    },
    //设置排列对齐
    setVerticalAlign:function(height){

        var verticalAlign = this.setting.verticalAlign,
            top = 0;
        if(verticalAlign === "middle"){
            top = (this.setting.height - height) / 2
        }else if(verticalAlign === "top"){
            top = 0
        }else if(verticalAlign === "bottom"){
            top = this.setting.height - height
        }else{
            top = (this.setting.height - height) / 2
        }

        return top;


    },
    //设置剩余的帧的位置关系
    setPostersPos:function(){
        var that = this;
        var sliceItems = this.posterItems.slice(1),
            sliceLength = sliceItems.length / 2,
            rightItems = sliceItems.slice(0,sliceLength),
            level = Math.floor(this.posterItems.length / 2),
            leftItems = sliceItems.slice(sliceLength);
        //设置右边帧的位置关系等
        
        var rw = this.setting.posterWidth,
            rh = this.setting.posterHeight,
            gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;
        
        var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
        var fixOffsetLeft = firstLeft + rw;
        
        rightItems.each(function(i){
            level--;
            rw = rw * that.setting.scale;
            rh = rh * that.setting.scale;
            var j = i;
            $(this).css({
                         zIndex:level,
                         width:rw,
                         height:rh,
                         opacity:1/(++j),
                         left:fixOffsetLeft + (++i) * gap -rw,
                         top:that.setVerticalAlign(rh)
                       });
        })

        //设置左边帧的位置关系等
        
        var lw = rightItems.last().width(),
            lh = rightItems.last().height(),
            oloop = Math.floor(this.posterItems.length / 2); 
               
        leftItems.each(function(i){
            

            $(this).css({
                         zIndex:i,
                         width:lw,
                         height:lh,
                         opacity:1/(oloop),
                         left:i * gap,
                         top:that.setVerticalAlign(lh)
                       });

            oloop--;
            lw = lw / that.setting.scale;
            lh = lh / that.setting.scale;
        })

    },
    //设置配置参数值去控制基本的宽度高度。。。
    setSettingVal: function(){
        this.poster.css({
                          width:this.setting.width,
                          height:this.setting.height
                       });
        this.posterItemMain.css({
                                  width:this.setting.width,
                                  height:this.setting.height
                               });
        var w = (this.setting.width - this.setting.posterWidth) / 2;
        this.nextBtn.css({
                           width:w,
                           height:this.setting.height,
                           zIndex:Math.ceil(this.posterItems.length / 2)
                        });
        this.prevBtn.css({
                           width:w,
                           height:this.setting.height,
                           zIndex:Math.ceil(this.posterItems.length / 2)
                        });
        this.posterFirstItem.css({
                                  left:w,
                                  width:this.setting.posterWidth,
                                  height:this.setting.posterHeight,
                                  zIndex:Math.floor(this.posterItems.length / 2)
                                })
    },
 	//获取人工配置参数
 	getSetting: function(){
    	var setting = this.poster.attr("data-setting");
    	if(setting&&setting!=""){
            
    		return $.parseJSON(setting)

    	}else{
            return {};
    	}
 	}

 }
 Carousel.init = function(posters){
 	var that = this;
 	posters.each(function(){
       new that($(this));
 	})
 }

 window['Carousel'] = Carousel

})(jQuery);