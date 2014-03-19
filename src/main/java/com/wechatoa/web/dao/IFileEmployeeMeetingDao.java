/**
 * 
 */
package com.wechatoa.web.dao;

import java.util.List;

import com.wechatoa.web.vo.FileEmployeeMeetingVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午3:06:36
 */
public interface IFileEmployeeMeetingDao {
	public long addFileEmployeeMeeting(FileEmployeeMeetingVo femv);
	public List<Long> queryMySepcMeetingFile(long meetingId, String employeeId);
}
