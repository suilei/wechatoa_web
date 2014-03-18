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

import com.wechatoa.web.service.IEmployeeMeetingService;
import com.wechatoa.web.service.IMeetingService;
import com.wechatoa.web.vo.EmployeeMeetingVo;
import com.wechatoa.web.vo.MeetingVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午4:58:01
 */
@Controller
@RequestMapping("/meeting")
public class MeetingAction {
	
	@Autowired
	private IMeetingService ims;
	@Autowired
	private IEmployeeMeetingService iems;
	
	@RequestMapping("/addMeeting")
	public String addEmployee(MeetingVo mv, String eIdList, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("ims:" + ims);
		long meetingKey = ims.addMeeting(mv);
		String[] eIdArray = eIdList.split(",");
		if (eIdArray != null) {
			for (int i = 0; i < eIdArray.length; i++) {
				EmployeeMeetingVo emv = new EmployeeMeetingVo();
				emv.setEmployeeId(eIdArray[i]);
				emv.setMeetingId(meetingKey);
				iems.addEmployeeMeeting(emv);
			}
		}
		map.put("name", mv.getMeetingTitle());
		return "jsp/success/success";
	}
	
}
