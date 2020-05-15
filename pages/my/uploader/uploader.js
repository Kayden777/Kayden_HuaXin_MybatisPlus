// pages/my/uploader/uploader.js
//腾讯云上传图片
var COS = require('./cos-wx-sdk-v5')
var config = require('./config')
var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数

    // 方法一（推荐）服务器提供计算签名的接口
    /*
    wx.request({
        url: 'SIGN_SERVER_URL',
        data: {
            Method: params.Method,
            Key: params.Key
        },
        dataType: 'text',
        success: function (result) {
            callback(result.data);
        }
    });
    */

    // 方法二（适用于前端调试）
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});

//图片上传到腾讯云储存桶页面显示的成功信息数据
var requestCallback = function (err, data) {
  console.log(err || data);
  if (err && err.error) {
    wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
  } else if (err) {
    wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
  } else {
    wx.showToast({ title: '上传成功', icon: 'success', duration: 3000 });
  }
};
var option = {
  data: {
    list: [],
  },
};
//选择图片显示的画布
import WeCropper from '../we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio
const height = device.windowHeight - 70
const fs = width / 750 * 2
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',//确定裁剪后的图片，
    successimgSrc: '',//上传成功后的图片，返回后的地址
    cropperOpt: {
      id: 'cropper',
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 250) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: (height * 0.5 - 250 * 0.5), // 裁剪框y轴期起点
        width: 250, // 裁剪框宽度
        height: 250// 裁剪框高度
      }
    },
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },


  //选择图片
  uploadTap() {
    const self = this;
    var that = this;
    //点击上传之前弹出模态框,拍摄的图片不能选择原图
    wx.showModal({
      title: '提示',
      content: '拍摄照片时，不支持原图上传',
      cancelText:'返回',
      confirmText:'好的',
      success(res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
              const src = res.tempFilePaths[0];
              self.wecropper.pushOrign(src);
              //获取选择图片裁剪后的地址
              that.setData({
                imgSrc: src
              })
              console.log("imgSrc的值：" + that.data.imgSrc)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //上传图片
  getCropperImage(e) {
    var huuxinId = getApp().globalData.hxid;//上传图片的用户花心号
    var that = this;
    if (that.data.imgSrc == '') {
      wx.showToast({
        title: '上传内容不能为空',
        image: '../../../icon/uplose.png'
      })
      return;
    }
    wx.showToast({ //上传的图标
      title: '上传中',
      icon: 'loading',
      duration: 20000,
      success(res) {
        //上传图片到服务器
        //var tempFilePaths = res.tempFilePaths;
        var filePath = that.data.imgSrc
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名

        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: filePath,
          onProgress: function (info) {
            //上传成功返回函数
            //info里面有服务器中图片的地址，后期在后端将地址存入数据库
            console.log(JSON.stringify(info));
            console.log("图片的地址：" + Key);
            wx.request({
              url: 'http://148.70.46.55/picupload',
              header: {
                'content-type': 'application/json'
              },
              data:{
                huaxinid: huuxinId,
                uppictureaddress:"https://kayden-guiyu-1300026157.cos.ap-chengdu.myqcloud.com/"+Key //将上传到腾讯云的图片地址返回给后台保存
              }
            })
            //上传成功，跳转到我的个人页面
            wx.switchTab({
              url: '../../my/my',
            })
          }
        }, requestCallback);
      }
    })


    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    this.wecropper.getCropperImage((src) => {
      if (src) {
        that.setData({
          imgSrc: src
        })
        wx.hideToast()
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [src] // 需要预览的图片http链接列表
        // })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data
    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
    //刷新画面
    this.wecropper.updateCanvas()

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