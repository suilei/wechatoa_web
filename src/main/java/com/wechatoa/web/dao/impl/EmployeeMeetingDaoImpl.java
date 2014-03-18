/**
 * 
 */
package com.wechatoa.web.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.wechatoa.web.dao.IEmployeeMeetingDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.EmployeeMeetingVo;
import com.wechatoa.web.vo.TestVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午5:36:04
 */
@Component("employeeMeetingDao")
public class EmployeeMeetingDaoImpl extends AbstractBaseDao<TestVo> implements IEmployeeMeetingDao {

	@Override
	public long addEmployeeMeeting(final EmployeeMeetingVo emv) {
		KeyHolder keyHolder = new GeneratedKeyHolder();  
		final String sql = "insert into t_employee_meeting(e_id,m_id) values(?,?)";
	    getJdbcTemplate().update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(
					Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql,
						Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, emv.getEmployeeId());
				ps.setLong(2, emv.getMeetingId());
				return ps;
			}
	    }, keyHolder);
	    return keyHolder.getKey().longValue();
	}

}
