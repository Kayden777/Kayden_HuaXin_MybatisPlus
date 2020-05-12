package com.example.main.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
/**
 * 网上爬取的图片实体类，展示在小程序主页
 * @author 33360
 *2020.04.21
 */
@TableName(value = "hxPicture")
public class PictureSelenium implements Serializable{
	@TableId(value = "id",type = IdType.AUTO)
	private Integer id;
	private Integer pictureserial;
	private String pictureaddress;
	private String pictureclassify;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getPictureserial() {
		return pictureserial;
	}
	public void setPictureserial(Integer pictureserial) {
		this.pictureserial = pictureserial;
	}
	public String getPictureaddress() {
		return pictureaddress;
	}
	public void setPictureaddress(String pictureaddress) {
		this.pictureaddress = pictureaddress;
	}
	public String getPictureclassify() {
		return pictureclassify;
	}
	public void setPictureclassify(String pictureclassify) {
		this.pictureclassify = pictureclassify;
	}
	public PictureSelenium(Integer id, Integer pictureserial, String pictureaddress, String pictureclassify) {
		super();
		this.id = id;
		this.pictureserial = pictureserial;
		this.pictureaddress = pictureaddress;
		this.pictureclassify = pictureclassify;
	}
	public PictureSelenium() {
		super();
	}
	
}
