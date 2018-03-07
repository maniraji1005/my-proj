"use strict";var $viewportButtons=$('.mobile-btn, .tablet-btn, .desktop-btn'),$customizerButton=$('.customizer-btn'),$productList=$('.products-list'),$body=$('body'),$productIframeWrapper=$('#product-iframe-wrapper'),$productIframe=$('.product-iframe');$.each($products,function(key,object){$productList.append('<li><a class="product" data-id="'+ key+'" data-thumbnail-src="'+ object.img+'">'+ object.name+'</a></li>');});$('.purchase-btn').click(function(){if($current_product in $products){top.location.href=$products[$current_product]['purchase'];}
return false;});$('.customizer-btn').click(function(){if($current_product in $products){top.location.href='http://customizer.nyasha.me/#'+$products[$current_product]['name'];}
return false;});if(jQuery.browser.mobile){if($current_product in $products){top.location.href=$products[$current_product].url;}}
$('.remove-btn').click(function(){if($current_product in $products){top.location.href=$products[$current_product].url;}
return false;});function switcher_iframe_height(){if($body.hasClass('toggle'))return;if($productIframeWrapper.hasClass('tablet')||$productIframeWrapper.hasClass('mobile'))return;var $w_height=$(window).height(),$b_height=$('.switcher-bar').height()+ $('.switcher-body').height(),$i_height=$w_height- $b_height- 2;$productIframe.height($i_height);}
function switcher_viewport_buttons(){if('undefined'!==typeof $products[$current_product].responsive&&$products[$current_product].responsive===0){$('.desktop-btn').get(0).click();$viewportButtons.addClass('disabled').removeClass('visible').css({'opacity':0,'visibility':'hidden'});}else{$viewportButtons.removeClass('disabled').addClass('visible').css({'opacity':1,'visibility':'visible'});}}
function customizer_button(){if('undefined'!==typeof $products[$current_product].customizer&&$products[$current_product].customizer===0){$customizerButton.addClass('disabled').removeClass('visible').css({'opacity':0,'visibility':'hidden'});}else{$customizerButton.removeClass('disabled').addClass('visible').css({'opacity':1,'visibility':'visible'});}}
$(document).ready(switcher_iframe_height);$(window).on('resize load',switcher_iframe_height);$('.desktop-btn').on('click',function(){$productIframeWrapper.removeClass().addClass('desktop');switcher_iframe_height();return false;});$('.tablet-btn').on('click',function(){$productIframeWrapper.removeClass().addClass('tablet');$productIframe.removeAttr('style');return false;});$('.mobile-btn').on('click',function(){$productIframeWrapper.removeClass().addClass('mobile');$productIframe.removeAttr('style');return false;});$('.product-switcher > a').on('click',function(){$body.toggleClass('toggle');if(!$body.hasClass('toggle')){}
return false;});$productIframe.load(function(){$('.preloader, .preloading-icon').fadeOut(400);});$(document).ready(function(){$current_product=location.hash.replace('#','');if(!($current_product in $products)||$current_product===''){$current_product=location.search.replace('?product=','');if(!($current_product in $products)||$current_product===''){for(var key in $products)
if($products.hasOwnProperty(key))break;$current_product=key;}}
$('.product-switcher > a').html('<span class="product-name">'+$products[$current_product].name+'</span>'+' <div class="hamburger-icon"><span></span><span></span><span></span></div>').css({'width':$productList.width()});$('.purchase-btn > a').text('Buy');switcher_viewport_buttons();customizer_button();$productIframe.attr('src',$products[$current_product].url);$(".product-switcher .products-list li a").on({mouseenter:function(){var self=this;$(".img-preview").fadeOut('400',function(){$(this).find('.preview').attr("src",$(self).attr("data-thumbnail-src"));$(this).show();});},mouseleave:function(){$(".img-preview").hide();}});});$('.product').click(function(){$current_product=$(this).data('id');if($current_product in $products){$body.toggleClass('toggle');$('.preloader, .preloading-icon').fadeIn(400);$productIframe.load(function(){$('.preloader, .preloading-icon').fadeOut(400);});$('.product-switcher > a').html('<span class="product-name">'+$products[$current_product].name+'</span><div class="hamburger-icon"><span></span><span></span><span></span></div>');$('.purchase-btn > a').text('Buy');$productIframe.attr('src',$products[$current_product].url);location.hash='#'+ $current_product;}
switcher_viewport_buttons();customizer_button();return false;});