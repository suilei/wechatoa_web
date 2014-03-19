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

import com.wechatoa.web.dao.IEmployeeDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.EmployeeVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午2:29:56
 */
@Component("employeeDao")
public class EmployeeDaoImpl extends AbstractBaseDao<Object> implements IEmployeeDao{

	@Override
	public int saveEmployee(final EmployeeVo employeeVo) {
		KeyHolder keyHolder = new GeneratedKeyHolder();  
		final String sql = "insert into t_employee(e_id, e_name, e_gender, e_phone, e_email, e_avatar, dept_id) "
				+ "values (?,?,?,?,?,?,?)";
	    getJdbcTemplate().update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(
					Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql,
						Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, employeeVo.getEmployeeId());
				ps.setString(2, employeeVo.getEmployeeName());
				ps.setInt(3, employeeVo.getEmployeeGender());
				ps.setString(4, employeeVo.getEmployeePhone());
				ps.setString(5, employeeVo.getEmployeeEmail());
				ps.setString(6, employeeVo.getEmployeeAvatar());
				ps.setInt(7, employeeVo.getDeptId());
				return ps;
			}
	    }, keyHolder);
	    return keyHolder.getKey().intValue();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<EmployeeVo> queryEmployeeByEmployeeId(String employeeId) {
		String sql = "select * from t_employee where e_id = ?";  
		System.out.println("employeeId:" + employeeId);
        List<EmployeeVo> list = this.getJdbcTemplate().query(sql,  
                new Object[] { employeeId }, new EmployeeMapper()); 
        System.out.println("list:" + list);
        return list; 
	}
	
	@SuppressWarnings({ "rawtypes" })
    private class EmployeeMapper implements RowMapper {  
        public Object mapRow(ResultSet rs, int i) throws SQLException {  
        	EmployeeVo vo = new EmployeeVo(); 
        	vo.setId(rs.getInt("id"));
            vo.setEmployeeName(rs.getString("e_name"));
            vo.setEmployeeGender(rs.getInt("e_gender"));
            vo.setEmployeeId(rs.getString("e_id"));
            vo.setEmployeePhone(rs.getString("e_phone"));
            vo.setEmployeeEmail(rs.getString("e_email"));
            vo.setEmployeeAvatar(rs.getString("e_avatar"));
            vo.setDeptId(rs.getInt("dept_id"));
            return vo;  
        }  
    }
}
