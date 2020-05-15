// pages/index/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    sliderIdx: 0,
    sork: ["https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/activity/details-sork/8.jpg",
      "https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/activity/details-sork/2.jpg",
      "https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/activity/details-sork/3.jpg",
      "https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/activity/details-sork/4.jpg",
      ]
  },
  // 面板指示点的变化
  swiperChange: function (e) {
    let sliderIdx = e.detail.current
    this.setData({
      sliderIdx: sliderIdx
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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