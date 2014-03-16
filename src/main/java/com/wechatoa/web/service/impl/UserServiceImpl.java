/**
 *  Copyright (c)  2011-2020 Panguso, Inc.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of Panguso, 
 *  Inc. ("Confidential Information"). You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into with Panguso.
 */
package com.wechatoa.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.UserDaoImpl;
import com.wechatoa.web.service.IUserService;
import com.wechatoa.web.vo.UserVo;

/**
 * 
 * @author sui lei
 * @date 2014-3-16
 */
@Transactional
@Service
public class UserServiceImpl implements IUserService{

	@Autowired
	private UserDaoImpl userDao;
	
	@Override
    public void saveUser() {
	    UserVo userVo = new UserVo();
	    userVo.setUsername("suilei隋磊");
	    userVo.setPassword("123456");
	    
	    userDao.save(userVo);
    }

	@Override
    public List<UserVo> queryByUserName(String username) {
		List<UserVo> list = userDao.queryByUserName(username);
	    return list;
    }
	
}
