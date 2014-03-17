package com.wechatoa.web.dao.base;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcTemplate;

public abstract class AbstractBaseDao<T> {  
	  
    // SPRING JDBC模板接口 
	@Resource 
    private JdbcTemplate jdbcTemplate;  
  
    public JdbcTemplate getJdbcTemplate() {  
        return jdbcTemplate;  
    }  
  
    @Resource  
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {  
        this.jdbcTemplate = jdbcTemplate;  
    }  
}  