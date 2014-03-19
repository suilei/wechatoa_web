/**
 * 
 */
package com.wechatoa.web.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.EmployeeMeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午5:40:12
 */
@Service
public interface IEmployeeMeetingService {
	public long addEmployeeMeeting(EmployeeMeetingVo emv);
	public List<String> queryEmployeeIdByMeetingId(long meetingId);
}
