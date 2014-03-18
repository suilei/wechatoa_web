/**
 * 
 */
package com.wechatoa.web.service;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.MeetingRoomVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午3:42:06
 */
@Service
public interface IMeetingRoomService {
	public void addMeetingRoom(MeetingRoomVo mrv);
}
