// pages/classify/classifySon/classifySon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictureclassifyselecr:'',//接收分类页面穿过来的值

    title:"摸摸我吧",
    titleshow:0,
    topNum: 0,//返回向上按钮
    scrollTop: 0,//返回向上按钮

    pictureList: [],//显示头像图片字段,数据库拿数据

    isCanShow:0,//根据传过来的值判断是不是站外访问图片
    pic: "https://images.weserv.nl/?url=",//站外访问HTTP refer的图片
    
  },
 

  handleChange:function(e) {
    this.setData({
      title:'谢谢你~',
      titleshow:2
    });
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
  //回到顶部
  //监听页面高度(上滑或者下滑)
  onPageScroll: function (obj) {
    if (obj.scrollTop > 363) {
      this.setData({
        goTopStatus: true
      })
    }
  },
  goToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.setData({
      goTopStatus: false
    })
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("传过来的值是" + options.pictureclassifys)
    var that = this;
    that.setData({
      pictureclassifyselecr: options.pictureclassifys,
    })
    if (that.data.pictureclassifyselecr == '情侣') {
      that.setData({
        isCanShow: 2
      })  
      //console.log("进入if判断，isCanShow的值为："+that.data.isCanShow)
    }
    //页面加载访问后台数据
    wx.request({
      url: 'http://148.70.46.55/list',
      data: {
        pictureclassify: that.data.pictureclassifyselecr,
      },
      header: {
        'content-type': 'application/json'       // 默认值（固定，我开发过程中还没有遇到需要修改header的）     
      },
      success(res) {
        that.setData({
          pictureList: res.data
        })
        //console.log(res.data)    //成功之后的回调    
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