/**
 * 
 */
package com.wechatoa.web.vo;

import java.io.Serializable;

/**
 * @author suilei
 * @date 2014年3月18日 下午3:34:16
 */
public class MeetingRoomVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private int roomId;
	private String roomName;
	private String roomAddr;
	private int roomStatus;
	
	public int getRoomId() {
		return roomId;
	}
	public void setRoomId(int roomId) {
		this.roomId = roomId;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}
	public String getRoomAddr() {
		return roomAddr;
	}
	public void setRoomAddr(String roomAddr) {
		this.roomAddr = roomAddr;
	}
	public int getRoomStatus() {
		return roomStatus;
	}
	public void setRoomStatus(int roomStatus) {
		this.roomStatus = roomStatus;
	}
}
