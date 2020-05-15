// pages/my/sork/sork.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    userSork:[],//用户信息
  },
  //点击刷新排行
  refreshSork: function (e) {
    this.onLoad();
    wx.showToast({
      title: '刷新成功',
      image: '../../../icon/refresh.png',
      duration: 1000,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://148.70.46.55/selectsork',
      header:{
        'content-type': 'application/json' 
      },
      success(res){
        //访问接口成功回调
        console.log(res.data)
        that.setData({
          userSork:res.data
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