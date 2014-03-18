/**
 * 
 */
package com.wechatoa.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wechatoa.web.service.IMeetingRoomService;
import com.wechatoa.web.vo.MeetingRoomVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午3:47:52
 */
@Controller
@RequestMapping("/meetingRoom")
public class MeetingRoomAction {
	
	@Autowired
	private IMeetingRoomService imrs;
	
	@RequestMapping("/addMeetingRoom")
	public String addEmployee(MeetingRoomVo mrv, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("imrs:" + imrs);
		imrs.addMeetingRoom(mrv);
		map.put("name", mrv.getRoomName());
		return "jsp/success/success";
	}
}
