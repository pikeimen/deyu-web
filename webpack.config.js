'use strict';

//依赖模块
var path = require('path');
var webpack = require('webpack');
var validate = require('webpack-validator');
var globule = require('globule');
var glob = require('glob');
//清空发布目录
var CleanWebpackPlugin = require('clean-webpack-plugin');
//拷贝文件目录
var CopyWebpackPlugin = require('copy-webpack-plugin');
//html文件处理
var HtmlWebpackPlugin = require('html-webpack-plugin');
//css文件处理
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
// 是否需要进行文件压缩
var minify = true;

var resolve = {
    //引用时可以忽略后缀
    extensions: ['', '.js', '.css', '.scss', '.ejs', '.png', '.jpg'],
    root: []
}

//入口配置
var entry = {};

//将小于20K的图片用base64处理
entry['img'] = globule.find(
    './src/img/**/*.??g',
    './src/img/**/*.gif',
    {
        ignore : []
    }
);

//搜索所有模块的入口文件 进行打包
var entryArray = globule.find('./src/modules/*/*/entry.js');
for (var i = 0; i < entryArray.length; i++) {
    var p = entryArray[i], //获取路径
        lastOneIndex = p.lastIndexOf('/'), //获取倒数第1个'/'索引
        lastTwoIndex = p.lastIndexOf('/', lastOneIndex - 1), //获取倒数第2个'/'索引
        lastThreeIndex = p.lastIndexOf('/', lastTwoIndex - 1), //获取倒数第3个'/'索引
        pageName = p.substring(lastTwoIndex + 1, lastOneIndex), //获取页面名字
        moduleName = p.substring(lastThreeIndex + 1, lastTwoIndex); //获取模块名字
    entry[moduleName +'/' +pageName] = p;
};

//第三方库 和 项目公共文件
entry['vendor'] = './src/build/vendorEntry.js';

//输出相关配置
var outBasePath = 'deyu-web';//输出的根目录
var output = {
    //输出目录
    path: path.join(__dirname, outBasePath),
    publicPath:'/'+outBasePath+'/',
    //文件名称
    filename: './js/[name].min.js'
}

//加载器
var loaders = [
    //html加载器
    {
        test: /\.htm$/,
        loader: 'html'
    },
    //图片加载器
    {
        test: /\.(png|gif|jpg|jpeg)$/,
        loader: 'url-loader',
        query: {
            //图片大小小于1byte的转成base64码
            limit: 1,
            name: '/img/[name].[ext]'
        }
    },
    //字体加载器
    {  
        test: /\.(ttf|eot|svg|woff|woff2)$/,  
        loader: 'file',
        query: {
            name: '/fonts/[name].[ext]'
        }
    },
    //css文件加载器
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
    },
    //js文件加载器
    {
      test: /\.js$/,
      //exclude: [node_modules_dir],
      loader: 'babel'
    }
];

var plugins = [
    //清理目录
    new CleanWebpackPlugin([outBasePath], {
        root: '',
        verbose: true,
        dry: false
    }),
    new CopyWebpackPlugin([{ from : __dirname + '/src/resource', to:'resource' }]),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    //抽取css
    new ExtractTextPlugin('./css/[name].min.css', {allChunks: true} ), //-[chunkhash:8]
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"'+process.env.NODE_ENV+'"'
        }
    }),
    //将vendor模块单独打包
    new CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity,
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })
    
];

//抽取所有模块的.html文件 并打包（注：一定要使用glob.sync来检索，否则不能按照指定顺序注入js、css）
var entryHtml = glob.sync('./src/modules/**/*.html');
entryHtml.forEach(function (filePath) {
    var p = filePath,
        lastOneIndex = p.lastIndexOf('/'), //获取倒数第1个'/'索引
        lastTwoIndex = p.lastIndexOf('/', lastOneIndex - 1), //获取倒数第2个'/'索引
        lastThreeIndex = p.lastIndexOf('/', lastTwoIndex - 1), //获取倒数第3个'/'索引
        pageName = p.substring(lastTwoIndex + 1, lastOneIndex), //获取页面名字
        moduleName = p.substring(lastThreeIndex + 1, lastTwoIndex); //获取模块名字
        //该页面需要注入的模块
        var chunk = ['vendor', moduleName +'/'+pageName];
    plugins.push(
        new HtmlWebpackPlugin({
            chunks: chunk,   //注入页面需要的js、css文件
            inject:'true',
            minify: {        //压缩html
                removeComments: minify,
                collapseWhitespace: minify
            },
            template: p,     //源模板文件
            filename: moduleName + '/' + pageName + '.html', //输出文件
            chunksSortMode: function (chunk1, chunk2) {
                //按照指定的顺序注入js、css
                var order = chunk;
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2;  
            },
            hash: true        //hash值，防止出现发布代码后js、css缓存的问题
        })
    );
});

//文件压缩
if (minify) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({ // js、css都会压缩
            mangle: {
                except: ['$super','$', 'exports', 'require', 'module', '_']
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        })
    )
}

//服务器配置相关
var devServer = {
    host : 'localhost',
    port : 8080,
    hot : false,//代码热替换
    inline: true//设置为true，当源文件改变时会自动刷新页面
}

var config = {
    entry: entry,
    resolveLoader: {root: path.join(__dirname, 'node_modules')},
    output: output,
    module: {
        loaders: loaders
    },
    resolve: resolve,
    plugins: plugins,
    devServer : devServer
}

module.exports = validate(config);