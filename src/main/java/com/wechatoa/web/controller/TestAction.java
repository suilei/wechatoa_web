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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wechatoa.web.service.ITestService;
import com.wechatoa.web.vo.MeetingRoomVo;
import com.wechatoa.web.vo.TestVo;


/**
 * 
 * @author sui lei
 * @date 2014-3-16
 */
@Controller
@RequestMapping("/test")
public class TestAction {
	@Autowired
	private ITestService userService;
	@RequestMapping("/saveUser")
	public String saveUser(ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("userService:" + userService);
		int key = userService.saveUser();
		map.put("name", key);
		return "jsp/success/success";
	}
	
	@RequestMapping("/queryUser")
	@ResponseBody
	public List<TestVo> queryUser(){
		System.out.println("userService:" + userService);
		return userService.queryByUserName("suilei隋磊");
	}
}
