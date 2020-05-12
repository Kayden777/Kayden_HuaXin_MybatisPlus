package com.example.main.service;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.main.entity.PictureSelenium;
import com.example.main.entity.Sork;
import com.example.main.entity.UpPicture;
import com.example.main.entity.User;

/**
 * 爬虫图片接口，方法
 * 
 * @author 33360 2020.04.21
 */
public interface PictureSeleniumService {

	// 根据图片分类查询所有图片
	List<PictureSelenium> selepicList(String pictureclassify);

	// 根据用户的openId查询用户
	User selectUser(String useropenid);
	
	//插入用户信息到用户表
	void insertUser(User user);
	
	//根据用户的userhuaxinid查询用户
	User selectUseruserhuaxinid(String userhuaxinid);
	
	// 根据用户花心号查询用户上传的图片---
	List<UpPicture> selectUpPicturesList(String hxid);
	
	// 当前花心用户上传图片
	void insertUpPicture(UpPicture upPicture);
	
	// 点赞功能，根据当前图片点赞+1
	void likeUpdate(String uppictureaddress);
	
	// 根据此用户，判断此用户上传的图片是否被点赞
	List<UpPicture> LikeStatesNum(String huaxinid);
	
	// 本用户查看点赞后，将图片点赞状态设置为不点赞状态
	void likeUpdateStates(String huaxinid);
	
	// 根据当前微信的openid 修改用户微信的头像及名字
	void updateuseravatarUrlandName(String useravatarUrl,String usernickName,String useropenid);

	// 查询排行榜
	List<Sork> listSorkList();
}
