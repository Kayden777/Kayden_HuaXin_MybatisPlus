// pages/my/aboutme/aboutme.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    errorHtml:0,//如果没有图片，就显示错误空白页面，0是没有，1是有
    userUp: [],//用户上传图片的信息
    userpreviewImage:[],//预览数组

    spinShow: true,
    switch: false,
  },
  onSwitchChange({ detail }) {
    const value = detail.value;
    this.setData({
      switch: value,
      spinShow: !value
    });
  },

  //在新窗口打开图片(点开图片，看大图)
  previewImg: function (e) {
    var that = this;
    console.log("新的数组的值是：" + that.data.userpreviewImage)
    console.log("当前图片下标："+e.currentTarget.dataset.index);
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
      },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //根据该用户的花心id，查询其上传的图片
    var huuxinId = getApp().globalData.hxid;
    wx.request({
      url: 'http://148.70.46.55/myupload',
      header:{
        'content-type': 'application/json' 
      },
      data:{
        hxid: huuxinId
      },
      success(res){
        if (res.data!=""){
          for (var index in res.data) {
            console.log("循环输出："+index+",地址" + res.data[index].uppictureaddress)
            that.setData({
              userpreviewImage: that.data.userpreviewImage.concat(res.data[index].uppictureaddress)
            })
          }
          that.setData({
            userUp: res.data,
            errorHtml: 1
          })
          console.log("新的数组：" + that.data.userpreviewImage)
          console.log(res.data)
        }else{
          that.setData({
            errorHtml: 0
          })
        }
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