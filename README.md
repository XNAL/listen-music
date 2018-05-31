## 前言

因为之前工作的原因先学习了Vue.js，但一直对React.js都比较感兴趣，特别是React Native，对于跨平台的方案想学习下如何去开发。而且公司也在开始逐渐使用RN来结合原生APP进行开发，但不是很急，所以还是打算先学下React.js。


界面主要参考QQ音乐的界面来开发，数据来源也是使用QQ音乐的api，大部分接口通过`JSONP`来访问，其中`获取歌单详情`和`获取歌曲歌词`两个接口需要通过后端代理转发来实现，此处使用`Node`进行了简单的开发。


## 在线访问

1. 直接访问[http://music.tdon.site(PC访问时请打开调试，使用手机模式访问，效果更佳)](http://music.tdon.site)

2. 手机扫码直接访问

   ![二维码](http://p508dzzc2.bkt.clouddn.com/listen-music/listen-music-qrcode.png)

## 技术栈

React.js + React-Router + Redux + ES6 + Webpack


## 运行项目

```javascript
git clone https://github.com/XNAL/listen-music.git

cd listen-music

npm install

node proxyServer.js  // (获取歌单和歌词使用Node进行代理转发)

npm start

// 访问 http://localhost:3000
```


## 效果图

1. 推荐

   ![推荐](http://p508dzzc2.bkt.clouddn.com/listen-music/index.png)

   

2. 歌手

   ![歌手](http://p508dzzc2.bkt.clouddn.com/listen-music/singers.png)

   

3. 歌手详情

   ![歌手详情](http://p508dzzc2.bkt.clouddn.com/listen-music/singer-info.png)

   

4. 排行榜

   ![排行榜](http://p508dzzc2.bkt.clouddn.com/listen-music/rank.png)

   

5. 排行榜详情

   ![排行榜详情](http://p508dzzc2.bkt.clouddn.com/listen-music/rank-info.png)

   

6. 搜索

   ![搜索](http://p508dzzc2.bkt.clouddn.com/listen-music/search.png)

   

7. 搜索结果

   ![搜索结果](http://p508dzzc2.bkt.clouddn.com/listen-music/search-result.png)