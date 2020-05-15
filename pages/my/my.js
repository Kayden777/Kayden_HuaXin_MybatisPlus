  // pages/my/my.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userHXID: "",//用户花心号
    buttonclass: 2,
    userInfo: {}, //用户信息属性

    usermessage: 0,//用户上传的图片是否被点赞，点赞数据库字段更新
    redMessage: 0,//用户是否点击有红点的提示元素,2表示点赞的

    loginSuccess:0,//当前页面登录了吗？0没有登录显示，1位显示登录
    uppicURL:'',//上传图片跳转路径
    mypicURL: '',//我的上传跳转路径
    helpURL: '',//助力好友跳转路径
    sorkURL:'',//点赞排行
  },

  getUserInfo: function (e) {
    let that = this;
    this.setData({
      loginSuccess:1
    })
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          //根据code获取用户的openID
          wx.login({
            //获取code
            success:function(res){
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              var code = res.code;//登录凭证
              wx.getUserInfo({
                lang: "zh_CN",
                success(res) {
                  console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                  //发起网络请求
                  wx.request({
                    url: "http://148.70.46.55/updateUser",
                    header: {
                      'content-type': 'application/json' 
                    },
                    data: {
                      code: code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      userhuaxinid: getApp().globalData.hxid,
                    },
                  })
                  that.setData({
                    userInfo: res.userInfo,
                    buttonclass: 0,
                    userHXID: "花心号：" + getApp().globalData.hxid
                  })
                },
                fail(res) {
                  console.log("获取用户信息失败", res)
                }
              })
            }
          })
          
        } else {
          console.log("未授权=====")
          that.showSettingToast("请授权")
        }
      }
    })
  },
  //点击红点提示
  redClick: function () {
    var that = this;
    if (that.data.loginSuccess == 1) {
      this.setData({
        mypicURL: '../../pages/my/aboutme/aboutme',
      })

      //清除小红点，改变数据库点赞状态
      wx.request({
        url: 'http://148.70.46.55/deleteLike',
        header: {
          'content-type': 'application/json'
        },
        data: {
          huaxinid: getApp().globalData.hxid
        },
        success(res) {
          that.setData({
            redMessage: 0,
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '使用此功能需要登录',
        confirmText: '返回登录',
      })
    }
   
  },

//点击链接跳转前是否登录
  jumpURL:function(e){
    var that = this;
    if (that.data.loginSuccess==1){
      this.setData({
        uppicURL:'../../pages/my/uploader/uploader',
        mypicURL: '../../pages/my/aboutme/aboutme',
        helpURL:'../../pages/my/helpfriend/helpfriend',
        sorkURL:'../../pages/my/sork/sork',
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '使用此功能需要登录',
        confirmText:'返回登录',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      usermessage: 0,   
    })
    //用户点击我的个人页面时，tabbar右上方的红点提示消失
    if (that.data.usermessage < 1) {
      //tabbar右上角文字显示
      wx.removeTabBarBadge({
        index: 2,
      })
    }


    //检查有没有人点赞我的图片
    wx.request({
      url: 'http://148.70.46.55/likestate',
      header: {
        'content-type': 'application/json'
      },
      data: {
        huaxinid: getApp().globalData.hxid//当前用户的花心号
      },
      success(res) {
        console.log("当前点赞用户java信息:" + res.data)
        //如果用户上传的图片被点赞，tabbar右上方的红点提示显示
        if (res.data != "") {
          // 如果有人点赞了，就显示小红点
         that.setData({
           redMessage:2,
         })
        }
      }
    })

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'http://148.70.46.55/userlogin',
          data: {
            code: res.code,//用户身份唯一标识
          },
          header: {
            'content-type': 'application/json'       // 默认值（固定，我开发过程中还没有遇到需要修改header的）     
          },
          success(res) {
            //成功回调
            //console.log("请求java后台成功，返回的花心号是：" + res.data)
          }
        })
      }
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})