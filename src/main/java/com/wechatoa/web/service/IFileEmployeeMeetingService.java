/**
 * 
 */
package com.wechatoa.web.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.FileEmployeeMeetingVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午3:16:37
 */
@Service
public interface IFileEmployeeMeetingService {
	public long addFileEmployeeMeeting(FileEmployeeMeetingVo femv);
	public List<Long> queryMySepcMeetingFile(long meetingId, String employeeId);
}
