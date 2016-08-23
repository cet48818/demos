function Switchable(container, conf) {
    var defaultConf = {
        width: 800,
        height: 500,
        duration: 300,
        autoplay: false,
        interval: 3000
    };
    this.conf = conf || {};
    this.conf = $.extend(defaultConf, this.conf);
    this.wrap = null;
    this.container = $(container);
    this.items = this.container.find('>li');
    this.num = this.items.length;
    this.timerId = null;
    this.indicatorWrap = null;
    this.indicators = null;
    this.index = 0;
    this.currentIndex = null;
    this.init();
}

Switchable.prototype.init = function() {
    var conf = this.conf;
    // 构建DOM
    var container = this.container;
    container.css('width', this.num * this.conf.width);
    // 包裹层
    container.wrap('<div class="switchable-wrap"></div>')
            .addClass('switchable-container');
    this.wrap = $('.switchable-wrap');
    // 指示层
    var indicatorWrap = this.indicatorWrap = $('<div class="switchable-indicators"></div>');
    container.after(indicatorWrap);
    this.items.addClass('switchable-item')
              .each(function(index, item) {
                  indicatorWrap.append('<div data-index="' + index + '" class="switchable-indicator"></div>');
                  $(item).find('>a').addClass('switchable-link');
                  $(item).find('img').css({
                      width: conf.width,
                      height: conf.height
                  });
              });
    this.indicators = indicatorWrap.find('.switchable-indicator');
    this.indicators.eq(0).addClass('current');
    this.currentIndex = 0;

    this.preBtn = $('<div class="switchable-arrow prev-arrow"><div class="arrow arrow-left"></div></div>');
    this.nextBtn = $('<div class="switchable-arrow next-arrow"><div class="arrow arrow-right"></div></div>');
    indicatorWrap.after(this.preBtn).after(this.nextBtn);

    // 设置包裹层宽高
    this.wrap.css({
        width: conf.width,
        height: conf.height
    });
    this.bind();
};

Switchable.prototype.bind = function() {
    var me = this;
    // 绑定圆点位置指示
    this.indicatorWrap.on('click', '.switchable-indicator', function(e) {
        me.curIndex = me.indicators.find('.current').index();
        
        if ($(this).hasClass('current')) {
            return;
        }
        me.index = $(this).index();
        if (me.currentIndex > me.index) {
            me.gotoPage(me.index, false);
        } else {
            me.gotoPage(me.index, true);
        }
        
    });
    // 绑定左右箭头
    this.nextBtn.on('click', function(e) {
        me.gotoNext();
    });
    this.preBtn.on('click', function(e) {
        me.gotoPre();
    });
    
    // 自动播放
    if (this.conf.autoplay === true) {
        this.autoTask();
    }
    // hover时停止播放
    this.wrap.mouseenter(function() {
        window.clearTimeout(me.timerId);
        me.timerId = null;
    })
        .mouseleave(function() {
        me.autoTask();
    });
};

Switchable.prototype.gotoPre = function() {
    // var preIndex = this.index = (this.num + (--this.index)) % this.num;
    this.index -= 1;
    if (this.index < 0) {
        this.index = this.num - 1;
    }
    this.gotoPage(this.index, false);
};

Switchable.prototype.gotoNext = function() {
    // var nextIndex = this.index = ++this.index % this.num;
    this.index += 1;
    if (this.index > this.num - 1) {
        this.index = 0;
    }
    this.gotoPage(this.index, true);
};

Switchable.prototype.gotoPage = function(index, flag) {
    var container = this.container;
    var width = this.conf.width;
    var duration = this.conf.duration;
    var me = this;
    // 停止自动轮播
    clearInterval(this.timerId);
    this.timerId = null;
    this.indicators.each(function(index, item) {
        $(item).removeClass('current');
    })
    this.indicators.eq(index).addClass('current');
    if (flag === true) {
        if (index === 0) {
            this.items.eq(0).clone().appendTo(this.container);
            container.css('width', (this.num + 1) * width);           
            index = this.num;
        }
        if (!container.is(':animated')) {
            container.animate({
                'left': -index * width
            }, duration, function() {
                if ($(this).find('>li').length === me.num + 1) {
                    container.css('left', 0); 
                    $(this).children().last().remove();
                    container.css('width', me.num * width); 
                }
            });
        }
    } else {
        if (index === this.num - 1) {
            this.items.eq(this.num - 1).clone().prependTo(this.container);
            container.css('left', -width);
            container.css('width', (this.num + 1) * this.conf.width);           
            index = 0;
        }
        if (!container.is(':animated')) {
            container.animate({
                'left': -index * width
            }, duration, function() {
                if ($(this).find('>li').length === me.num + 1) {
                    index = me.num - 1;
                    container.css('left', -width * index);
                    $(this).children().first().remove();
                    container.css('width', me.num * width); 
                }
            });
        }
    }
    this.currentIndex = index;
    // 开始自动轮播
    this.autoTask();
};

Switchable.prototype.autoTask = function() {
    var me = this;
    this.timerId = window.setInterval(function(){me.gotoNext()}, me.conf.interval);
};