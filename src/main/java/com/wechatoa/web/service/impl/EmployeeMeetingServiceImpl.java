/**
 * 
 */
package com.wechatoa.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.EmployeeMeetingDaoImpl;
import com.wechatoa.web.service.IEmployeeMeetingService;
import com.wechatoa.web.vo.EmployeeMeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午5:41:33
 */
@Transactional
@Service
public class EmployeeMeetingServiceImpl implements IEmployeeMeetingService {

	@Autowired
	private EmployeeMeetingDaoImpl emdi;
	/* (non-Javadoc)
	 * @see com.wechatoa.web.service.IEmployeeMeetingService#addEmployeeMeeting(com.wechatoa.web.vo.EmployeeMeetingVo)
	 */
	@Override
	public long addEmployeeMeeting(EmployeeMeetingVo emv) {
		long key = emdi.addEmployeeMeeting(emv);
		return key;
	}
	@Override
	public List<String> queryEmployeeIdByMeetingId(long meetingId) {
		return emdi.queryEmployeeIdByMeetingId(meetingId);
	}

}
