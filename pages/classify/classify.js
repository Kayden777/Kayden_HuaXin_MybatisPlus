// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   pictureclassify:'',//按照分类查询图片
  },

  jump:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.text)
    that.setData({
      pictureclassify: e.currentTarget.dataset.text
    })
    wx.navigateTo({
      //跳转页面的时候传分类值过去
      url: '../../pages/classify/classifySon/classifySon?pictureclassifys=' + that.data.pictureclassify,
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