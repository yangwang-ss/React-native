# WebView公共能力支持
## 分享能力
参数：

```
isShare: true || false
shareInfo: shareTitle 、shareText、shareTkl、shareImageUrl
```

## 原生能力

参数

```
jsJump: true || false
jumpInfo: 
	type: detail || TB  || undefined || null
```
传参格式如下：
### type 等于 detail 
```javascript
jumpInfo = {
	type: 'detail',
	pid: '*****'
}
```

### type 等于 TB
```javascript
jumpInfo = {
	type: 'TB',
	url: '*****'
}
``` 
### type 等于 undefined || null  可以跳转至任何RN页面
```javascript
jumpInfo = {
	routeName: '*****',
	params: {}
}
``` 

## 回退能力
```
isPop: true
```