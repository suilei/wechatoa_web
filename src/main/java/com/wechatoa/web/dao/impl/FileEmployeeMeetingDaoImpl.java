/**
 * 
 */
package com.wechatoa.web.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.wechatoa.web.dao.IFileEmployeeMeetingDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.FileEmployeeMeetingVo;

/**
 * @author suilei
 * @date 2014年3月19日 下午3:07:40
 */
@Component("fileEmployeeMeetingDao")
public class FileEmployeeMeetingDaoImpl extends AbstractBaseDao<Object> implements IFileEmployeeMeetingDao {

	/* (non-Javadoc)
	 * @see com.wechatoa.web.dao.IFileEmployeeMeetingDao#addFileEmployeeMeeting(com.wechatoa.web.vo.FileEmployeeMeetingVo)
	 */
	@Override
	public long addFileEmployeeMeeting(final FileEmployeeMeetingVo femv) {
		KeyHolder keyHolder = new GeneratedKeyHolder();  
		final String sql = "insert into t_employee_meeting_file(e_id,f_id,m_id) values(?,?,?)";
	    getJdbcTemplate().update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(
					Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql,
						Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, femv.getEmployeeId());
				ps.setLong(2, femv.getFileId());
				ps.setLong(3, femv.getMeetingId());
				return ps;
			}
	    }, keyHolder);
	    return keyHolder.getKey().longValue();
	}

	@Override
	public List<Long> queryMySepcMeetingFile(long meetingId, String employeeId) {
		String sql = "select f_id from t_employee_meeting_file where m_id = ? and e_id = ?";  
		System.out.println("meetingId:" + meetingId);
        List<Long> list = this.getJdbcTemplate().queryForList(sql,  
                new Object[] { meetingId, employeeId }, Long.class); 
        System.out.println("list:" + list);
        return list; 
	}

}
