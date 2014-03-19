/**
 * 
 */
package com.wechatoa.web.dao.impl;

import org.springframework.stereotype.Component;

import com.wechatoa.web.dao.IMeetingRoomDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.MeetingRoomVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午3:39:27
 */
@Component("meetingRoomDao")
public class MeetingRoomDaoImpl extends AbstractBaseDao<Object> implements IMeetingRoomDao {

	@Override
	public void saveMeetingRoom(MeetingRoomVo mrv) {
		String save_sql = "insert into t_meeting_room(r_name,r_addr) values(?,?)";
		getJdbcTemplate().update(save_sql, mrv.getRoomName(), mrv.getRoomAddr());
	}
}
