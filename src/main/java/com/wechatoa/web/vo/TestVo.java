/**
 *  Copyright (c)  2011-2020 Panguso, Inc.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of Panguso, 
 *  Inc. ("Confidential Information"). You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into with Panguso.
 */
package com.wechatoa.web.vo;

import java.io.Serializable;

/**
 * 
 * @author sui lei
 * @date 2014-3-16
 */
public class TestVo implements Serializable{
	/**
     * 
     */
    private static final long serialVersionUID = 1L;
    
	private String username;
	private String password;
	public String getUsername() {
    	return username;
    }
	public void setUsername(String username) {
    	this.username = username;
    }
	public String getPassword() {
    	return password;
    }
	public void setPassword(String password) {
    	this.password = password;
    }
}
