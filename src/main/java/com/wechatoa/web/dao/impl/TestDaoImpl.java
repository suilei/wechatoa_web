/**
 *  Copyright (c)  2011-2020 Panguso, Inc.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of Panguso, 
 *  Inc. ("Confidential Information"). You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into with Panguso.
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

import com.wechatoa.web.dao.ITestDao;
import com.wechatoa.web.dao.base.AbstractBaseDao;
import com.wechatoa.web.vo.TestVo;

/**
 * 
 * @author sui lei
 * @date 2014-3-16
 */
@Component("testDao")
public class TestDaoImpl extends AbstractBaseDao<TestVo> implements ITestDao{

	@Override
    public int save(final TestVo userVo) {
		KeyHolder keyHolder = new GeneratedKeyHolder();  
		final String sql = "insert into t_test_user(username,password) values(?,?)";
	    getJdbcTemplate().update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(
					Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql,
						Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, userVo.getUsername());
				ps.setString(2, userVo.getPassword());
				return ps;
			}
	    }, keyHolder);
	    return keyHolder.getKey().intValue();
    }

	@SuppressWarnings("unchecked")
    @Override
    public List<TestVo> queryByUserName(String username) {
		String sql = "select * from t_test_user where username = ?";  
        List<TestVo> list = this.getJdbcTemplate().query(sql,  
                new Object[] { username }, new UserMapper());  
        return list;  
    }
	
	@SuppressWarnings({ "rawtypes" })
    private class UserMapper implements RowMapper {  
        public Object mapRow(ResultSet rs, int i) throws SQLException {  
            TestVo vo = new TestVo();  
            vo.setUsername(rs.getString("username"));  
            vo.setPassword(rs.getString("password"));  
            return vo;  
        }  
    }  
}
