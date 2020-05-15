//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //userhxid:'',

    usermessage: 0,//用户上传的图片是否被点赞，点赞数据库字段更新
    truefalsePicList: 0,//判断有没有图片传进来
    pictureclassifys: '全部',//首页分类导航栏搜索
    pictureList: [],//显示头像图片字段,数据库拿数据
    pic: '',//控制站外访问图片403
    topNum: 0,//返回向上按钮
    scrollTop: 0,//返回向上按钮
    current: '',
    current_scroll: '',//分类导航栏
    scrollTopTitle: 0,//分类标签选择
    isCanShow: 0,//判断是否是站外图片


    swiperH: '',//swiper高度
    nowIdx: 0,//当前swiper索引
    imgList: [//活动图片列表
      'https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/activity/activity-swiper/huo1.png',
      'https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/activity/activity-swiper/huo2.png',
      'https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/activity/activity-swiper/huo3.png',

    ],


    picnum: 1,
    rollData: [//每日热点新闻
      "用户:HX68***7分享了小程序",
      "HX32***7成功为HX56***4助力",
      "用户:HX43***1分享了小程序",
      "用户HX91***2上传了一张图片",
      "HX48***4成功为HX66***2助力",
      "HX19***7成功为HX38***3助力",
    ],
  },



  //控制回到顶部按钮的显示与消失
  onPageScroll: function (e) {//监听页面滚动
    this.setData({
      scrollTop: e.scrollTop,
    })
  },


  // 分类导航栏标签选择事件
  handleChangeScroll({ detail }) {
    var that = this;
    this.setData({
      current_scroll: detail.key,
      pictureclassifys: detail.key,
    });
    console.log("选择的分类是：" + this.data.current_scroll);
    if (this.data.current_scroll == '情侣') {
      that.setData({
        pic: "https://images.weserv.nl/?url=",
      })
    } else {
      that.setData({
        pic: '',
      })
    }
    wx.request({
      url: 'http://148.70.46.55/list',
      data: {
        pictureclassify: that.data.pictureclassifys,//默认参数是全部
      },
      header: {
        'content-type': 'application/json'       // 默认值（固定，我开发过程中还没有遇到需要修改header的）     
      },
      success(res) {
        that.setData({
          pictureList: res.data,
          truefalsePicList: 2,
        })
        //console.log(res.data)    //成功之后的回调    
      }
    })
  },


  //回到顶部
  //监听页面高度(上滑或者下滑)
  goToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.setData({
      goTopStatus: false
    })
  },



  //在新窗口打开图片(点开图片，看大图)
  previewImg: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;//当前图片的下标
    var prcturenew = that.data.pictureList;
    wx.previewImage({
      current: prcturenew[index],   //当前图片地址
      urls: prcturenew,               //所有要预览的图片的地址集合 数组形式
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
  //获取swiper高度
  getHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 2;//获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;
    var sH = winWid * imgh / imgw + "rpx"
    this.setData({
      swiperH: '300rpx'//设置高度
    })
  },
  //swiper滑动事件
  swiperChange: function (e) {
    this.setData({
      nowIdx: e.detail.current
    })
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    //在数据库判断图片是否被点赞，如果用户上传的图片被点赞，tabbar右上方的红点提示显
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'http://148.70.46.55/userlogin',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json'       // 默认值（固定，我开发过程中还没有遇到需要修改header的）     
          },
          success(res) {
            //成功回调
            console.log("请求java后台成功，返回的花心号是：" + res.data)
            wx.request({
              url: 'http://148.70.46.55/likestate',
              header: {
                'content-type': 'application/json'
              },
              data: {
                huaxinid: res.data //当前用户的花心号
              },
              success(res) {
                console.log("当前点赞用户java信息:" + res.data)
                //如果用户上传的图片被点赞，tabbar右上方的红点提示显示
                if (res.data != "") {
                  //tabbar右上角文字显示
                  wx.setTabBarBadge({
                    index: 2,
                    text: 'new',
                  })
                }
              }
            })
          }
        })
      }
    })


    //页面加载访问后台数据--图片
    wx.request({
      url: 'http://148.70.46.55/list',
      data: {
        pictureclassify: that.data.pictureclassifys,//默认参数是全部
      },
      header: {
        'content-type': 'application/json'       // 默认值（固定，我开发过程中还没有遇到需要修改header的）     
      },
      success(res) {
        that.setData({
          pictureList: res.data,
          truefalsePicList: 2
        })
        //console.log(that.data.pictureList)    //成功之后的回调    
      }
    })

  },
})
