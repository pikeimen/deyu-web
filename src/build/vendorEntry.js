/*
* @Author: vip
* @Date:   2017-07-13 11:15:28
* @Last Modified by:   vip
* @Last Modified time: 2017-07-20 13:22:29
*/

//第三方库 打包【包括（npm install安装的） 和 （手动下载的）】
require('jquery');
var BDtpl = require('../vendors/js/baiduTemplate1.0.6');
var videojs = require('../vendors/js/video');
require('../vendors/css/videojs');

//设置flash路径，Video.js会在不支持html5的浏览中使用flash播放视频文件
videojs.options.flash.swf = "../resource/video-js.swf";
//百度模板引擎（ 设置左分隔符为 <! ）
BDtpl.template.LEFT_DELIMITER = '<!';
//百度模板引擎（ 设置右分隔符为 !> ）
BDtpl.template.RIGHT_DELIMITER = '!>';

//引入boostrap
require('bootstrap/dist/js/bootstrap.min.js');
require('bootstrap/dist/css/bootstrap.min.css');

//【全局工程调用的文件】
require('../css/global'); //全局样式
require('../js/global'); //全局js
require('../js/validate'); //全局js