package com.example.main.controller;

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.example.main.entity.PictureSelenium;
import com.example.main.entity.Sork;
import com.example.main.entity.UpPicture;
import com.example.main.entity.User;
import com.example.main.service.PictureSeleniumService;
import com.example.main.util.HttpRequestUtil;
import com.example.main.util.MiNiProjectUtil;

@Controller
public class MiniPrjController {

	@Autowired
	private PictureSeleniumService pictureSeleniumService;

	/** Redis数据库 **/
	@Autowired
	private RedisTemplate<Object, Object> redistemplate;

	/** 按照图片分类查询图片 **/
	@RequestMapping("/list")
	public void getPictureSeleniums(HttpServletResponse response, String pictureclassify) throws Exception {
		response.setContentType("text/html;charset=utf-8");
		/* 设置响应头允许ajax跨域访问 */
		response.setHeader("Access-Control-Allow-Origin", "*");
		/* 星号表示所有的异域请求都可以接受， */
		response.setHeader("Access-Control-Allow-Methods", "GET,POST");

		// 创建result集合对象返回给小程序；
		List<String> list2 = new ArrayList<String>();

		// 查询到的结果
		List<PictureSelenium> list = pictureSeleniumService.selepicList(pictureclassify);
		for (PictureSelenium pictureSelenium : list) {
			list2.add(pictureSelenium.getPictureaddress());
		}
		String str = JSON.toJSONString(list2);

		// 返回值给微信小程序
		Writer out = response.getWriter();
		out.write(str);
		out.flush();
	}

	/** 获取用户身份唯一标识 **/
	@RequestMapping("/userlogin")
	@ResponseBody
	public void userLogin(String code, HttpServletResponse response) throws IOException {

		// 小程序唯一标识 (在微信小程序管理后台获取)
		String appid = "wx1329cdbe76a2abe4";
		// 小程序的 app secret (在微信小程序管理后台获取)
		String appSecret = "4a5b33fc91a51027ca1a210a4ced172e";
		// 授权（必填）
		String grant_type = "authorization_code";

		// 请求微信服务器，使用code获取openid和session_key
		// 请求参数
		String param = "appid=" + appid + "&secret=" + appSecret + "&js_code=" + code + "&grant_type=" + grant_type;
		// 发送请求
		String sr = HttpRequestUtil.sendGet("https://api.weixin.qq.com/sns/jscode2session", param);
		// 解析相应内容（转换成json对象）
		JSONObject json = JSONObject.parseObject(sr);
		// 用户的唯一标识（openid）
		String openid = (String) json.get("openid");
		String HXID = "";
		String num = "";
		// 查询这个用户是否登录过小程序
		User userYesOrNo = pictureSeleniumService.selectUser(openid);
		if (userYesOrNo != null) {
			HXID = userYesOrNo.getUserhuaxinid();
		} else {
			do {
				HXID = "HX" + (int) ((Math.random() * 9 + 1) * 100000);
				String redisHuaXinId = (String) redistemplate.opsForValue().get(HXID);
				if (redisHuaXinId == null) {
					num = null;
					redistemplate.opsForValue().set(HXID, HXID);
				}
			} while (num != null);
			// 循环出来发现redis数据库没有此花心id用户，存入数据库
			User user = new User(0, HXID, openid, "", "");
			pictureSeleniumService.insertUser(user);
			HXID = HXID;
		}

		// 注册成功后将分配给用户的花心id返回给小程序
		Writer out = response.getWriter();
		String str = JSON.toJSONString(HXID);
		out.write(str);
		out.flush();
	}

	/** 用户查看我的上传 **/
	@RequestMapping("myupload")
	public void upPictures(HttpServletResponse response, String hxid) throws IOException {
		System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		response.setContentType("text/html;charset=utf-8");
		/* 设置响应头允许ajax跨域访问 */
		response.setHeader("Access-Control-Allow-Origin", "*");
		/* 星号表示所有的异域请求都可以接受， */
		response.setHeader("Access-Control-Allow-Methods", "GET,POST");
		hxid ="HX666666";
		// 创建result集合对象返回给小程序；
		List<UpPicture> myuploadList = pictureSeleniumService.selectUpPicturesList(hxid);
		for (UpPicture upPicture : myuploadList) {
			System.out.println("图片的地址是："+upPicture.getUppictureaddress());
		}
		
		String str = JSON.toJSONString(myuploadList);
		// 返回值给微信小程序
		Writer out = response.getWriter();
		out.write(str);
		out.flush();
	}

	/** 用户上传头像，数据存在数据库 **/
	@RequestMapping("picupload")
	public void uploadpic(HttpServletResponse response, String huaxinid, String uppictureaddress) {
		response.setContentType("text/html;charset=utf-8");
		/* 设置响应头允许ajax跨域访问 */
		response.setHeader("Access-Control-Allow-Origin", "*");
		/* 星号表示所有的异域请求都可以接受， */
		response.setHeader("Access-Control-Allow-Methods", "GET,POST");
		// 当前日期
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:MM:SS");
		Date date = new Date(System.currentTimeMillis());
		String timeString = formatter.format(date);

		UpPicture upPicture = new UpPicture();
		upPicture.setHuaxinid(huaxinid);
		upPicture.setUppictureaddress(uppictureaddress);
		upPicture.setUploadtime(timeString);
		pictureSeleniumService.insertUpPicture(upPicture);
	}

	/** 用户点赞图片 **/
	@RequestMapping("like")
	public void likepic(HttpServletResponse response, String uppictureaddress) {
		response.setContentType("text/html;charset=utf-8");
		/* 设置响应头允许ajax跨域访问 */
		response.setHeader("Access-Control-Allow-Origin", "*");
		/* 星号表示所有的异域请求都可以接受， */
		response.setHeader("Access-Control-Allow-Methods", "GET,POST");
		// 当前日期
		pictureSeleniumService.likeUpdate(uppictureaddress);
	}

	/** 用户是否被点赞 **/
	@RequestMapping("likestate")
	public void likestate(HttpServletResponse response, String huaxinid) throws IOException {
		response.setContentType("text/html;charset=utf-8");
		/* 设置响应头允许ajax跨域访问 */
		response.setHeader("Access-Control-Allow-Origin", "*");
		/* 星号表示所有的异域请求都可以接受， */
		response.setHeader("Access-Control-Allow-Methods", "GET,POST");
		List<UpPicture> likestates = pictureSeleniumService.LikeStatesNum(huaxinid);
		if (likestates.size() > 0) {
			// 返回值给微信小程序
			Writer out = response.getWriter();
			out.write("被点赞");
			out.flush();
		} else {
			// 返回值给微信小程序
			Writer out = response.getWriter();
			out.write("");
			out.flush();
		}
	}

	/**
	 * 用户查看点赞图片，改变点赞图片为不点赞
	 * 
	 * @throws IOException
	 **/
	@RequestMapping("deleteLike")
	public void likepicState(HttpServletResponse response, String huaxinid) throws IOException {
		response.setContentType("text/html;charset=utf-8");
		/* 设置响应头允许ajax跨域访问 */
		response.setHeader("Access-Control-Allow-Origin", "*");
		/* 星号表示所有的异域请求都可以接受， */
		response.setHeader("Access-Control-Allow-Methods", "GET,POST");
		pictureSeleniumService.likeUpdateStates(huaxinid);
		// 返回值给微信小程序
		Writer out = response.getWriter();
		out.write("java后端清除点赞成功");
		out.flush();
	}

	/** 获取用户头像、名称并且修改 **/
	@RequestMapping(value = "updateUser", method = { RequestMethod.POST, RequestMethod.GET })
	@ResponseBody
	public void updateuser(String encryptedData, String iv, String code,String userhuaxinid) {
		// 小程序唯一标识 (在微信小程序管理后台获取)
		String appid = "wx1329cdbe76a2abe4";
		// 小程序的 app secret (在微信小程序管理后台获取)
		String appSecret = "4a5b33fc91a51027ca1a210a4ced172e";
		// 授权（必填）
		String grant_type = "authorization_code";
		// 请求微信服务器，使用code获取openid和session_key
		// 请求参数
		String param = "appid=" + appid + "&secret=" + appSecret + "&js_code=" + code + "&grant_type=" + grant_type;
		// 发送请求
		String sr = HttpRequestUtil.sendGet("https://api.weixin.qq.com/sns/jscode2session", param);
		// 解析相应内容（转换成json对象）
		JSONObject json = JSONObject.parseObject(sr);
		// 用户的唯一标识（openid）
		String openid = (String) json.get("openid");
		// 获取会话密钥（session_key）
		String session_key = json.get("session_key").toString();
		JSONObject result = MiNiProjectUtil.getUserInfo(encryptedData, session_key, iv);
		String useravatarUrl =(String) result.get("avatarUrl") ;
		String usernickName = (String) result.get("nickName");
		pictureSeleniumService.updateuseravatarUrlandName(useravatarUrl, usernickName, openid);
	}
	
	/** 查询排行榜 
	 * @throws IOException **/
	@RequestMapping("selectsork")
	@ResponseBody
	public void listSork(HttpServletResponse response) throws IOException {
		List<Sork> list = pictureSeleniumService.listSorkList();
		String str = JSON.toJSONString(list);
		//传递中文乱码设置
		response.setContentType("text/json;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		// 返回值给微信小程序
		Writer out = response.getWriter();
		out.write(str);
		out.flush();
	}

}
