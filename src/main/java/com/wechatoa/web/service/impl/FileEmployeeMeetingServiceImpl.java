/**
 * 
 */
package com.wechatoa.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.FileEmployeeMeetingDaoImpl;
import com.wechatoa.web.service.IFileEmployeeMeetingService;
import com.wechatoa.web.vo.FileEmployeeMeetingVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午3:17:50
 */
@Transactional
@Service
public class FileEmployeeMeetingServiceImpl implements
		IFileEmployeeMeetingService {
	@Autowired
	private FileEmployeeMeetingDaoImpl femdi;
	/* (non-Javadoc)
	 * @see com.wechatoa.web.service.IFileEmployeeMeetingService#addFileEmployeeMeeting(com.wechatoa.web.vo.FileEmployeeMeetingVo)
	 */
	@Override
	public long addFileEmployeeMeeting(FileEmployeeMeetingVo femv) {
		long key = femdi.addFileEmployeeMeeting(femv);
		return key;
	}
	@Override
	public List<Long> queryMySepcMeetingFile(long meetingId, String employeeId) {
		return femdi.queryMySepcMeetingFile(meetingId, employeeId);
	}

}
