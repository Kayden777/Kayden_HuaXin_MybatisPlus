package com.example.main.entity;
/**
 * 点赞排行实体类（使用SQL查询的结果映射）
 * @author 33360
 *
 */
public class Sork {
	private String usernickName;
	private String useravatarUrl;
	private int sumcount;
	public String getUsernickName() {
		return usernickName;
	}
	public void setUsernickName(String usernickName) {
		this.usernickName = usernickName;
	}
	public String getUseravatarUrl() {
		return useravatarUrl;
	}
	public void setUseravatarUrl(String useravatarUrl) {
		this.useravatarUrl = useravatarUrl;
	}
	public int getSumcount() {
		return sumcount;
	}
	public void setSumcount(int sumcount) {
		this.sumcount = sumcount;
	}
	public Sork(String usernickName, String useravatarUrl, int sumcount) {
		super();
		this.usernickName = usernickName;
		this.useravatarUrl = useravatarUrl;
		this.sumcount = sumcount;
	}
	public Sork() {
		super();
	}
	
}
