/**
 * 
 */
package com.wechatoa.web.dao;

import java.util.List;

import com.wechatoa.web.vo.EmployeeMeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午5:33:53
 */
public interface IEmployeeMeetingDao {
	public long addEmployeeMeeting(EmployeeMeetingVo emv);
	public List<String> queryEmployeeIdByMeetingId(long meetingId);
}
