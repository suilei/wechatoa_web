/**
 * 
 */
package com.wechatoa.web.vo.json;

import java.io.Serializable;

import com.wechatoa.web.vo.MeetingVo;


/**
 * @author suilei
 * @date 2014年3月19日 下午4:04:58
 */
public class MeetingJsonVo extends MeetingVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String meetingOwnerName;
	public String getMeetingOwnerName() {
		return meetingOwnerName;
	}
	public void setMeetingOwnerName(String meetingOwnerName) {
		this.meetingOwnerName = meetingOwnerName;
	}
}
