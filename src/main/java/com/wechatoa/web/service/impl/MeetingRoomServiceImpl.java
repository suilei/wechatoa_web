/**
 * 
 */
package com.wechatoa.web.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.MeetingRoomDaoImpl;
import com.wechatoa.web.service.IMeetingRoomService;
import com.wechatoa.web.vo.MeetingRoomVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午3:43:20
 */
@Transactional
@Service
public class MeetingRoomServiceImpl implements IMeetingRoomService {

	@Autowired
	private MeetingRoomDaoImpl mrdi;
	
	@Override
	public void addMeetingRoom(MeetingRoomVo mrv) {
		mrdi.saveMeetingRoom(mrv);
	}
}
