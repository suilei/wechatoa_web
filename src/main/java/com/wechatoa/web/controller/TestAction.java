/**
 *  Copyright (c)  2011-2020 Panguso, Inc.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of Panguso, 
 *  Inc. ("Confidential Information"). You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into with Panguso.
 */
package com.wechatoa.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wechatoa.web.service.IUserService;
import com.wechatoa.web.vo.UserVo;


/**
 * 
 * @author sui lei
 * @date 2014-3-16
 */
@Controller
public class TestAction {
	@Autowired
	private IUserService userService;
	@RequestMapping("/")
	public String index(){
		System.out.println("userService:" + userService);
		userService.saveUser();
		return "";
	}
	
	@RequestMapping("/queryUser")
	@ResponseBody
	public List<UserVo> queryUser(){
		System.out.println("userService:" + userService);
		return userService.queryByUserName("suilei隋磊");
	}
}
