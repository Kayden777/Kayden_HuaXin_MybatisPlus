// pages/my/helpfriend/helpfriend.js
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteImg: 'null', //如果输入框有字，就显示，否则相反
    inputValue: '', //input输入的值
    userSelect:'',//需要查询的用户
    ispeoples:0,//判断是否查到人
    likeimgIndex:-3,//点赞图片下标
    likeimgAddress: '',//点赞图片地址
    frientext:'快点搜索好友吧！',//404图标下面的文字
    likeyesOrno:'',
    userUp: [],//用户上传图片的信息
    userpreviewImage:[],//预览图片放大
  },

  //在新窗口打开图片(点开图片，看大图)
  previewImg: function (e) {
    var that = this;
    console.log("新的数组的值是：" + that.data.userpreviewImage)
    console.log("当前图片下标：" + e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;//当前图片的下标
    var prcturenew = that.data.userUp;
    console.log("prcturenew的值:" + prcturenew[index].uppictureaddress)
    wx.previewImage({
      current: prcturenew[index].uppictureaddress,   //当前图片地址
      urls: that.data.userpreviewImage,               //所有要预览的图片的地址集合 数组形式
      success: function (res) {
        console.log("当前图片地址" + prcturenew[index])
      },
      fail: function (res) {
        console.log("点击图片失败了:")
        // console.log(that.data.pictureList)
        // console.log(that.data.prcturenew)
      },
      complete: function (res) { },
    })
  },
  /**
   * 获取input内容-input键盘输入事件
   */
  getInputVal: function(e) {
    var that = this;
    let input_text = e.detail.value
    //console.log("input的值：" + input_text)
    if (input_text != '') {
      that.setData({
        deleteImg: 'isNull'
      })
    } else {
      that.setData({
        deleteImg: 'null'
      })
    }
  },
  /**
   * 删除input文本内容
   */
  deleteIcon: function() {
    var that = this;
    that.setData({
      inputValue:'',
      deleteImg: 'null',
      ispeoples:0,
      likeyesOrno: '',
      likeimgIndex:-3,
    })
  },
  /**
   * submitClick表单提交事件
   */
  submitClick:function(e){
    var that = this;
    console.log("提交过来的input值：" + e.detail.value.userName)
    var inputUser = e.detail.value.userName;
    if (inputUser == '') {
      //如果输入内容为空
      wx.showToast({
        title: '查询不能为空',
        image: '../../../icon/nopeople.png',//自定义图标的本地路径，image 的优先级高于 icon
        duration: 2500,//提示的延迟时间，单位毫秒，默认：1500 
        mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
        success: function () {
          that.setData({
            ispeoples: 0,
          })
          return;
        },
      })
    }else{
      //查询内容不为空时
      wx.request({
        url: 'http://148.70.46.55/myupload',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hxid: inputUser
        },
        success(res) {
          if (res.data == ""){
            console.log("查询失败")
            wx.showToast({
              title: '查不到此人哦~',
              image: '../../../icon/nopeople.png',//自定义图标的本地路径，image 的优先级高于 icon
              duration: 2500,//提示的延迟时间，单位毫秒，默认：1500 
              mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
              success: function () {
                that.setData({
                  ispeoples: 0,//没查到人
                  frientext: '这个人好像不存在！'
                })
                return;
              },
            })
          }else{
            for (var index in res.data) {
              console.log("循环输出：" + index + ",地址" + res.data[index].uppictureaddress)
              that.setData({
                userpreviewImage: that.data.userpreviewImage.concat(res.data[index].uppictureaddress)
              })
            }
            that.setData({
              userUp:res.data,
              ispeoples: 2 ,//查到人
              userSelect: res.data[0].huaxinid
            })
            wx.getStorage({ //获取用户点赞的下标（本地内存中）
              key: that.data.userSelect,
              success: function (res) {
                that.setData({
                  likeimgIndex: res.data,
                  likeyesOrno:'点过赞'
                })
              },
            })
            //console.log("查询成功,查到的数据是：" + res.data)        
          }
          
        },
      })
    }
  },
  /**
   * likeimg 点赞事件
   */
  likeimg:function(e){
    var that = this;
    let likeindex = parseInt(e.target.dataset.index);//获取当前点赞图片下标
    console.log("当前存进本地内存的用户的花心号:" + that.data.userSelect)
    //在本地内存中判断是否点过赞
    var likeyesOrno2 = wx.getStorageSync(that.data.userSelect) || [];//先获取本地储存的历史搜索记录
    console.log("点赞的下标是：" + likeindex+",历史记录有什么：" + wx.getStorageSync(that.data.userSelect) || [])
    
    if (that.data.likeyesOrno == ''){
      that.setData({
        likeimgIndex: likeindex,
        //likeimgAddress: that.data.userUp[likeindex].imgUp,
      })
        // 如果获取不到被点赞用户图片的下标，就存在本地
      wx.setStorage({
        //将当前用户点赞的下标存进本地
        key: that.data.userSelect, //key是查找的用户id，
        data: likeindex,
      })
      //加载页面是获取当前时间，如果时间大于昨天,就清除本地点赞缓存
      var time = util.formatTime(new Date());
      wx.setStorage({
        key: 'yesterday',
        data: time,
      })
      wx.showToast({//提示已经点赞成功
        title: '点赞成功',
        image: '../../../icon/likeSuccess.png',//自定义图标的本地路径，image 的优先级高于 icon
        duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
        mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
        success: function () {
          that.setData({
            likeyesOrno:'点过赞',
          })
        },
      })
      //点赞的方法
      wx.request({
        url: 'http://148.70.46.55/like',
        header:{
          'content-type': 'application/json'
        },
        data:{
          uppictureaddress: that.data.userUp[likeindex].uppictureaddress,
        },
        success(res){
        }
      })
    }else{
      //如果已经点赞，没操作
  
      wx.showToast({//提示今天已经点过赞
        title: '今天点过赞哦~',
        image: '../../../icon/alert.png',//自定义图标的本地路径，image 的优先级高于 icon
        duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
        mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
        success: function () {
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    //加载页面是获取当前时间，如果时间大于昨天,就清除本地点赞缓存
    let yeterdaytime = wx.getStorageSync('yesterday') || [];//先获取本地储存的历史搜索记录
    if (yeterdaytime != ''){
      console.log("昨天时间：" + yeterdaytime)
      var time = util.formatTime(new Date());
      console.log("现在时间：" + time)
      if (time > yeterdaytime) {
        console.log("清除本地点赞记录")
        wx.clearStorageSync()
      } else {
        console.log("一天还没过去呢")
      }
    }
    

    console.log("加载页面时likeyesOrno的值：" + this.data.likeyesOrno)
    wx.getStorage({
      key: 'HX666666',
      success: function(res) {
        console.log("加载页面时HX666666的值：" + res.data)
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})