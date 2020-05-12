package com.example.main.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.main.entity.PictureSelenium;
import com.example.main.entity.Sork;
import com.example.main.entity.UpPicture;
import com.example.main.entity.User;
import com.example.main.mapper.pictureSeleniumMapper;
import com.example.main.service.PictureSeleniumService;

/**
 * 爬虫图片接口方法的实现类
 * 
 * @author 33360 2020.04.21
 */
@Service
@Transactional
public class PictureSeleniumServiceimpl implements PictureSeleniumService {

	@Autowired
	private pictureSeleniumMapper pic;

	/** 注入SpringBoot自动配置好Redis的RedisTemplate **/
	@Autowired
	private RedisTemplate<Object, Object> redisTemplate;

	
	/** 根据分类查询图片 **/
	@Override
	public List<PictureSelenium> selepicList(String pictureclassify) {		
		/** 字符串序列化器编码 **/
		RedisSerializer redisSerializer = new StringRedisSerializer();
		redisTemplate.setKeySerializer(redisSerializer);

		List<PictureSelenium> redispicturelist = (List<PictureSelenium>) redisTemplate.opsForValue().get(pictureclassify);

		//加synchronized锁，悲观锁
		if (redispicturelist == null) {
			synchronized (this) {
				redispicturelist = (List<PictureSelenium>) redisTemplate.opsForValue().get(pictureclassify);
				if (redispicturelist == null) {
					// redis缓存为空的时候，查询数据库
					redispicturelist = pic.selectPicLictListMapper(pictureclassify);
					// 将值放入该key中。.set()方法
					redisTemplate.opsForValue().set(pictureclassify, redispicturelist);
				} 
			}
		}
		return redispicturelist;
	}

	/** 根据好友的微信号openid查询好友 **/
	@Override
	public User selectUser(String useropenid) {
		/** 字符串序列化器编码 **/
		RedisSerializer redisSerializer = new StringRedisSerializer();
		redisTemplate.setKeySerializer(redisSerializer);
		User userOpendIdUserkey = (User) redisTemplate.opsForValue().get(useropenid);
		//加synchronized锁，悲观锁
				if (userOpendIdUserkey == null) {
					synchronized (this) {
						userOpendIdUserkey = (User) redisTemplate.opsForValue().get(useropenid);
						if (userOpendIdUserkey == null) {
							// redis缓存为空的时候，查询数据库
							userOpendIdUserkey = (User) pic.selectUser(useropenid);
							// 将值放入该key中。.set()方法
							redisTemplate.opsForValue().set(useropenid, userOpendIdUserkey);
							System.out.println("在数据库中读数据！！！");
						} 
					}
				}
		return userOpendIdUserkey;
	}
	
	/** 添加用户信息 **/
	@Override
	public void insertUser(User user) {
		/** 字符串序列化器编码 **/
		RedisSerializer redisSerializer = new StringRedisSerializer();
		redisTemplate.setKeySerializer(redisSerializer);
		
		pic.insertUser(user);
	}

	/** 根据好友的花心id查询好友 **/
	@Override
	public User selectUseruserhuaxinid(String userhuaxinid) {
		/** 字符串序列化器编码 **/
		RedisSerializer redisSerializer = new StringRedisSerializer();
		redisTemplate.setKeySerializer(redisSerializer);
		return pic.selectUseruserhuaxinid(userhuaxinid);
	}

	/**根据用户的花心号，查询上传的图片列表,点赞数，及上传日期**/
	@Override
	public List<UpPicture> selectUpPicturesList(String hxid) {
		return pic.selectUpPicturesList(hxid);
	}
	
	
	/**当前花心用户上传图片**/
	@Override
	public void insertUpPicture(UpPicture upPicture) {
		pic.insertUpPicture(upPicture);
	}

	/**点赞功能，根据当前图片点赞+1**/
	@Override
	public synchronized void likeUpdate(String uppictureaddress) {
		//加悲观锁，防止并发
		pic.likeUpdate(uppictureaddress);
	}


	/**根据此用户，判断此用户上传的图片是否被点赞**/

	@Override
	public List<UpPicture> LikeStatesNum(String huaxinid) {
		
		return pic.LikeStatesNum(huaxinid);
	}
	
	/**本用户查看点赞后，将图片点赞状态设置为不点赞状态 **/
	@Override
	public void likeUpdateStates(String huaxinid) {
		pic.likeUpdateStates(huaxinid);
	}

	@Override
	public void updateuseravatarUrlandName(String useravatarUrl, String usernickName, String useropenid) {
		pic.updateuseravatarUrlandName(useravatarUrl, usernickName, useropenid);
	}

	@Override
	public List<Sork> listSorkList() {
		return pic.listSorkList();
	}


}
