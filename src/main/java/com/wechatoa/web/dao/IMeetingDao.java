/**
 * 
 */
package com.wechatoa.web.dao;

import java.util.List;

import com.wechatoa.web.vo.MeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午4:38:19
 */
public interface IMeetingDao {
	public long addMeeting(MeetingVo mv);
	public List<MeetingVo> queryMeetingByEmployeeId(String employeeId);
}
