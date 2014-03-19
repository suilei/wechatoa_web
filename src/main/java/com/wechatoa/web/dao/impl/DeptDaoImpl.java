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

import com.wechatoa.web.dao.IDeptDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.DeptVo;

/**
 * @author suilei
 * @date 2014年3月17日 下午6:35:24
 */
@Component("deptDao")
public class DeptDaoImpl extends AbstractBaseDao<Object> implements IDeptDao {

	@Override
	public int saveDept(final DeptVo deptVo) {
		KeyHolder keyHolder = new GeneratedKeyHolder();  
		final String sql = "insert into t_dept(dept_name,dept_desc) values(?,?)";
	    getJdbcTemplate().update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(
					Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql,
						Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, deptVo.getDeptName());
				ps.setString(2, deptVo.getDeptDesc());
				return ps;
			}
	    }, keyHolder);
	    return keyHolder.getKey().intValue();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DeptVo> queryDeptByName(String deptName) {
		String sql = "select * from t_dept where dept_name = ?";  
        List<DeptVo> list = this.getJdbcTemplate().query(sql,  
                new Object[] { deptName }, new DeptMapper()); 
        System.out.println("list:" + list);
        return list; 
	}
	@SuppressWarnings({ "rawtypes" })
    private class DeptMapper implements RowMapper {  
        public Object mapRow(ResultSet rs, int i) throws SQLException {  
            DeptVo vo = new DeptVo();  
            vo.setDeptId(rs.getInt("dept_id"));
            vo.setDeptName((rs.getString("dept_name")));  
            vo.setDeptDesc((rs.getString("dept_desc")));  
            return vo;  
        }  
    }
	@SuppressWarnings("unchecked")
	@Override
	public List<DeptVo> queryAllDept() {
		String sql = "select * from t_dept";  
        List<DeptVo> list = this.getJdbcTemplate().query(sql, new DeptMapper()); 
        System.out.println("list:" + list);
        return list; 
	}  
}
