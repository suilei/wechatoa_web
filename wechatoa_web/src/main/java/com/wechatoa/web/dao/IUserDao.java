/**
 *  Copyright (c)  2011-2020 Panguso, Inc.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of Panguso, 
 *  Inc. ("Confidential Information"). You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into with Panguso.
 */
package com.wechatoa.web.dao;

import java.util.List;

import com.wechatoa.web.vo.UserVo;

/**
 * 
 * @author sui lei
 * @date 2014-3-16
 */
public interface IUserDao {
	public void save(UserVo userVo);
	public List<UserVo> queryByUserName(String username);  
}
