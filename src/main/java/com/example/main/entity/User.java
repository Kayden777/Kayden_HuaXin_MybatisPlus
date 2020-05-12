package com.example.main.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

/**
 * 用户实体类
 * @author 33360
 *2020.04.26
 */

@TableName(value = "hxuser")
public class User implements Serializable{

	@TableId(value = "id",type = IdType.AUTO)
	private Integer id;
	@TableField(value = "userhuaxinid")
	private String userhuaxinid;
	private String useropenid;
	private String useravatarUrl;
	private String usernickName;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getUserhuaxinid() {
		return userhuaxinid;
	}
	public void setUserhuaxinid(String userhuaxinid) {
		this.userhuaxinid = userhuaxinid;
	}
	public String getUseropenid() {
		return useropenid;
	}
	public void setUseropenid(String useropenid) {
		this.useropenid = useropenid;
	}
	public String getUseravatarUrl() {
		return useravatarUrl;
	}
	public void setUseravatarUrl(String useravatarUrl) {
		this.useravatarUrl = useravatarUrl;
	}
	public String getUsernickName() {
		return usernickName;
	}
	public void setUsernickName(String usernickName) {
		this.usernickName = usernickName;
	}
	public User(Integer id, String userhuaxinid, String useropenid, String useravatarUrl, String usernickName) {
		super();
		this.id = id;
		this.userhuaxinid = userhuaxinid;
		this.useropenid = useropenid;
		this.useravatarUrl = useravatarUrl;
		this.usernickName = usernickName;
	}
	public User() {
		super();
	}
	
	
}
