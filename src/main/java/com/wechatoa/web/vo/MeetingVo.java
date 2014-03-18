/**
 * 
 */
package com.wechatoa.web.vo;

import java.io.Serializable;

/**
 * @author suilei
 * @date 2014年3月18日 下午4:30:00
 */
public class MeetingVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private long meetingId;
	private String meetingTitle;
	private String meetingDate;
	private double meetingDuration;
	private String meetingSummary;
	private int meetingStatus;
	private String meetingAvatar;
	// 对应eId，代表会议发起人
	private String meetingOwner;
	private int meetingRoomId;
	public long getMeetingId() {
		return meetingId;
	}
	public void setMeetingId(long meetingId) {
		this.meetingId = meetingId;
	}
	public String getMeetingTitle() {
		return meetingTitle;
	}
	public void setMeetingTitle(String meetingTitle) {
		this.meetingTitle = meetingTitle;
	}
	public String getMeetingDate() {
		return meetingDate;
	}
	public void setMeetingDate(String meetingDate) {
		this.meetingDate = meetingDate;
	}
	public double getMeetingDuration() {
		return meetingDuration;
	}
	public void setMeetingDuration(double meetingDuration) {
		this.meetingDuration = meetingDuration;
	}
	public String getMeetingSummary() {
		return meetingSummary;
	}
	public void setMeetingSummary(String meetingSummary) {
		this.meetingSummary = meetingSummary;
	}
	public int getMeetingStatus() {
		return meetingStatus;
	}
	public void setMeetingStatus(int meetingStatus) {
		this.meetingStatus = meetingStatus;
	}
	public String getMeetingAvatar() {
		return meetingAvatar;
	}
	public void setMeetingAvatar(String meetingAvatar) {
		this.meetingAvatar = meetingAvatar;
	}
	public String getMeetingOwner() {
		return meetingOwner;
	}
	public void setMeetingOwner(String meetingOwner) {
		this.meetingOwner = meetingOwner;
	}
	public int getMeetingRoomId() {
		return meetingRoomId;
	}
	public void setMeetingRoomId(int meetingRoomId) {
		this.meetingRoomId = meetingRoomId;
	}
}
