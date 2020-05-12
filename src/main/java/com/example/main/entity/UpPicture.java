package com.example.main.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

/**
 * 用户上传图片实体类
 * @author 33360
 *2020.04.28
 */
@TableName(value = "userpicture")
public class UpPicture implements Serializable{

	@TableId(value = "id",type = IdType.AUTO)
	private Integer id;
	private Integer likepicturenum;
	private String huaxinid;
	private String uppictureaddress;
	@TableField(value = "uploadtime")
	private String  uploadtime;
	private Integer likestate;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getLikepicturenum() {
		return likepicturenum;
	}
	public void setLikepicturenum(Integer likepicturenum) {
		this.likepicturenum = likepicturenum;
	}
	public String getHuaxinid() {
		return huaxinid;
	}
	public void setHuaxinid(String huaxinid) {
		this.huaxinid = huaxinid;
	}
	public String getUppictureaddress() {
		return uppictureaddress;
	}
	public void setUppictureaddress(String uppictureaddress) {
		this.uppictureaddress = uppictureaddress;
	}
	public String getUploadtime() {
		return uploadtime;
	}
	public void setUploadtime(String uploadtime) {
		this.uploadtime = uploadtime;
	}
	public Integer getLikestate() {
		return likestate;
	}
	public void setLikestate(Integer likestate) {
		this.likestate = likestate;
	}
	public UpPicture(Integer id, Integer likepicturenum, String huaxinid, String uppictureaddress, String uploadtime,
			Integer likestate) {
		super();
		this.id = id;
		this.likepicturenum = likepicturenum;
		this.huaxinid = huaxinid;
		this.uppictureaddress = uppictureaddress;
		this.uploadtime = uploadtime;
		this.likestate = likestate;
	}
	public UpPicture() {
		super();
	}
	
}
