/**
 * 
 */
package com.wechatoa.web.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.MeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午4:54:59
 */
@Service
public interface IMeetingService {
	public long addMeeting(MeetingVo mv);
	public List<MeetingVo> queryAllMeetingFromMe(String employeeId);
	public MeetingVo queryMeetingByMeetingId(long meetingId);
}
