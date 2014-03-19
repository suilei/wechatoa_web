/**
 * 
 */
package com.wechatoa.web.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.wechatoa.web.dao.IMeetingDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.MeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午4:39:31
 */
@Component("meetingDao")
public class MeetingDaoImpl extends AbstractBaseDao<Object> implements IMeetingDao {

	@Override
	public long addMeeting(final MeetingVo mv) {
		KeyHolder keyHolder = new GeneratedKeyHolder();  
		final String sql = "insert into t_meeting(m_date,m_duration,m_title,m_summary,m_status,m_avatar,m_owner,r_id) "
				+ "values(?,?,?,?,?,?,?,?)";
	    getJdbcTemplate().update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(
					Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql,
						Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, mv.getMeetingDate());
				ps.setDouble(2, mv.getMeetingDuration());
				ps.setString(3, mv.getMeetingTitle());
				ps.setString(4, mv.getMeetingSummary());
				ps.setInt(5, mv.getMeetingStatus());
				ps.setString(6, mv.getMeetingAvatar());
				ps.setString(7, mv.getMeetingOwner());
				ps.setInt(8, mv.getMeetingRoomId());
				return ps;
			}
	    }, keyHolder);
	    return keyHolder.getKey().longValue();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MeetingVo> queryMeetingByEmployeeId(String employeeId) {
		String sql = "select * from t_meeting where m_owner = ?";  
        List<MeetingVo> list = this.getJdbcTemplate().query(sql,  
                new Object[] { employeeId }, new MeetingMapper()); 
        System.out.println("list:" + list);
        return list; 
	}
	
	@SuppressWarnings({ "rawtypes" })
    private class MeetingMapper implements RowMapper {  
        public Object mapRow(ResultSet rs, int i) throws SQLException {  
        	MeetingVo vo = new MeetingVo(); 
        	vo.setMeetingId(rs.getLong("m_id"));
        	vo.setMeetingDate(rs.getString("m_date"));
        	vo.setMeetingDuration(rs.getDouble("m_duration"));
        	vo.setMeetingTitle(rs.getString("m_title"));
        	vo.setMeetingSummary(rs.getString("m_summary"));
        	vo.setMeetingStatus(rs.getInt("m_status"));
        	vo.setMeetingAvatar(rs.getString("m_avatar"));
        	vo.setMeetingOwner(rs.getString("m_owner"));
        	vo.setMeetingRoomId(rs.getInt("r_id"));
            return vo;  
        }  
    }

	@SuppressWarnings("unchecked")
	@Override
	public List<MeetingVo> queryAllMeetingFromMe(String employeeId) {
		String sql = "select * from t_meeting where m_owner = ?";  
        List<MeetingVo> list = this.getJdbcTemplate().query(sql,  
                new Object[] { employeeId }, new MeetingMapper()); 
        System.out.println("list:" + list);
        return list;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MeetingVo> queryMeetingByMeetingId(long meetingId) {
		String sql = "select * from t_meeting where m_id = ?";  
        List<MeetingVo> list = this.getJdbcTemplate().query(sql,  
                new Object[] { meetingId }, new MeetingMapper()); 
        System.out.println("list:" + list);
        return list;
	}
}
