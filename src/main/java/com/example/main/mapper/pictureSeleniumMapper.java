package com.example.main.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.main.entity.PictureSelenium;
import com.example.main.entity.Sork;
import com.example.main.entity.UpPicture;
/**
 * 爬虫图片的mapper
 * @author 33360
 *2020.04.21
 */
import com.example.main.entity.User;

@Mapper
public interface pictureSeleniumMapper extends BaseMapper<PictureSelenium> {

	// 按照图片的分类查询所有图片
	@Select("SELECT * from `hxPicture` h WHERE h.pictureclassify=#{pictureclassify} ")
	List<PictureSelenium> selectPicLictListMapper(@Param("pictureclassify") String pictureclassify);

	// 根据用户的openId查询用户
	@Select("SELECT * FROM `hxuser` h  WHERE h.useropenid= #{useropenid} ")
	User selectUser(@Param("useropenid") String useropenid);

	// 根据用户的userhuaxinid查询用户
	@Select("SELECT * FROM `hxuser` h  WHERE h.userhuaxinid= #{userhuaxinid} ")
	User selectUseruserhuaxinid(@Param("userhuaxinid") String userhuaxinid);

	// 插入用户信息到用户表
	@Insert("INSERT INTO `hxuser` VALUES (0,#{userhuaxinid},#{useropenid},useravatarUrl,usernickName) ")
	void insertUser(User user);
	
	// 根据用户花心号查询用户上传的图片
	@Select("SELECT * FROM `userpicture` u WHERE u.huaxinid=#{hxid}")
	List<UpPicture> selectUpPicturesList(@Param("hxid") String hxid);
	
	// 当前花心用户上传图片
	@Insert("INSERT INTO `userpicture`(id,huaxinid,uppictureaddress,uploadtime) VALUES (0,#{huaxinid},#{uppictureaddress},#{uploadtime})")
	void insertUpPicture(UpPicture upPicture);

	// 点赞功能，根据当前图片点赞+1
	@Update("UPDATE `userpicture` u SET u.likepicturenum=u.likepicturenum+1,u.likestate = 1 WHERE u.uppictureaddress =#{uppictureaddress}")
	void likeUpdate(@Param("uppictureaddress") String uppictureaddress);
	
	// 根据此用户，判断此用户上传的图片是否被点赞
	@Select("SELECT * FROM `userpicture` u WHERE  u.likestate=1 AND u.huaxinid = #{huaxinid} ")
	List<UpPicture> LikeStatesNum(@Param("huaxinid") String huaxinid);
	
	// 本用户查看点赞后，将图片点赞状态设置为不点赞状态
	@Update("UPDATE `userpicture` u SET u.likestate=0 WHERE u.huaxinid = #{huaxinid}")
	void likeUpdateStates(@Param("huaxinid") String huaxinid);
	
	// 根据当前微信的openid 修改用户微信的头像及名字
	@Update("update `hxuser` h SET h.useravatarUrl = #{useravatarUrl},h.usernickName = #{usernickName} WHERE h.useropenid = #{useropenid} ")
	void updateuseravatarUrlandName(@Param("useravatarUrl") String useravatarUrl,@Param("usernickName") String usernickName,@Param("useropenid") String useropenid);
	
	// 查询排行榜
	@Select("SELECT usernickName,useravatarUrl ,a.sumcount  FROM `hxuser` h INNER JOIN   (SELECT SUM(likepicturenum) as sumcount,huaxinid FROM `userpicture` u GROUP BY u.huaxinid ) a ON a.huaxinid = h.userhuaxinid ORDER BY a.sumcount DESC LIMIT 0,10")
	List<Sork> listSorkList();
}
