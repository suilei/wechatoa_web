/**
 * 
 */
package com.wechatoa.web.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.MeetingDaoImpl;
import com.wechatoa.web.service.IMeetingService;
import com.wechatoa.web.vo.MeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午4:55:51
 */
@Transactional
@Service
public class MeetingServiceImpl implements IMeetingService {

	@Autowired
	private MeetingDaoImpl mdi;
	/* (non-Javadoc)
	 * @see com.wechatoa.web.service.IMeetingService#addMeeting(com.wechatoa.web.vo.MeetingVo)
	 */
	@Override
	public long addMeeting(MeetingVo mv) {
		long key = mdi.addMeeting(mv);
		return key;
	}
}
