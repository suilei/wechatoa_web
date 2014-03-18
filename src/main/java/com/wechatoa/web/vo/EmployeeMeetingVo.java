/**
 * 
 */
package com.wechatoa.web.vo;

import java.io.Serializable;

/**
 * @author suilei
 * @date 2014年3月18日 下午5:32:20
 */
public class EmployeeMeetingVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private long id;
	private String employeeId;
	private long meetingId;
	private int isSignIn;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}
	public long getMeetingId() {
		return meetingId;
	}
	public void setMeetingId(long meetingId) {
		this.meetingId = meetingId;
	}
	public int getIsSignIn() {
		return isSignIn;
	}
	public void setIsSignIn(int isSignIn) {
		this.isSignIn = isSignIn;
	}
	
}
