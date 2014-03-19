/**
 * 
 */
package com.wechatoa.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wechatoa.web.service.IEmployeeMeetingService;
import com.wechatoa.web.service.IEmployeeService;
import com.wechatoa.web.service.IFileEmployeeMeetingService;
import com.wechatoa.web.service.IFileService;
import com.wechatoa.web.service.IMeetingService;
import com.wechatoa.web.vo.EmployeeMeetingVo;
import com.wechatoa.web.vo.EmployeeVo;
import com.wechatoa.web.vo.FileEmployeeMeetingVo;
import com.wechatoa.web.vo.FileVo;
import com.wechatoa.web.vo.MeetingVo;
import com.wechatoa.web.vo.json.MeetingDetailJsonVo;
import com.wechatoa.web.vo.json.MeetingJsonVo;

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
	@Autowired
	private IFileEmployeeMeetingService ifems;
	@Autowired
	private IEmployeeService ies;
	@Autowired
	private IFileService ifs;
	
	@RequestMapping("/queryMySpecMeetingInfo")
	@ResponseBody
	public MeetingDetailJsonVo queryMySpecMeetingInfo(String employeeId, long meetingId, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		MeetingDetailJsonVo mdjv = new MeetingDetailJsonVo();
		// 设置会议信息
		MeetingVo mv = ims.queryMeetingByMeetingId(meetingId);
		mdjv.setMv(mv);
		// 设置参会人信息
		List<String> employeeIdList = iems.queryEmployeeIdByMeetingId(meetingId);
		List<EmployeeVo> employeeList = new ArrayList<EmployeeVo>();
		if (employeeIdList != null && employeeIdList.size() > 0) {
			for (int i = 0; i < employeeIdList.size(); i++) {
				EmployeeVo ev = ies.queryEmployeeByEmployeeId(employeeIdList.get(i));
				employeeList.add(ev);
			}
		}
		mdjv.setEmployeeList(employeeList);
		// 设置我可见的文件列表
		List<Long> fileIdList = ifems.queryMySepcMeetingFile(meetingId, employeeId);
		List<FileVo> fileList = new ArrayList<FileVo>();
		if (fileIdList != null && fileIdList.size() > 0) {
			for (int i = 0; i < fileIdList.size(); i++) {
				FileVo fv = ifs.queryFileByFileId(fileIdList.get(i));
				fileList.add(fv);
			}
		}
		mdjv.setFileList(fileList);
		return mdjv;
	}
	@RequestMapping("/queryAllMeetingFromMe")
	@ResponseBody
	public List<MeetingJsonVo> queryAllMeetingFromMe(String employeeId, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		List<MeetingVo> list = ims.queryAllMeetingFromMe(employeeId);
		EmployeeVo ev = ies.queryEmployeeByEmployeeId(employeeId);
		List<MeetingJsonVo> listJson = new ArrayList<MeetingJsonVo>();
		if (list != null && list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				MeetingJsonVo mjv = new MeetingJsonVo();
				mjv.setMeetingTitle(list.get(i).getMeetingTitle());
				mjv.setMeetingDate(list.get(i).getMeetingDate());
				mjv.setMeetingStatus(list.get(i).getMeetingStatus());
				mjv.setMeetingId(list.get(i).getMeetingId());
				mjv.setMeetingOwnerName(ev.getEmployeeName());
				listJson.add(mjv);
			}
		}
		return listJson;
	}
	@RequestMapping("/addMeeting")
	public String addMeeting(MeetingVo mv, String eIdList, String eIdfIdList, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("ims:" + ims);
		
		// 添加会议
		long meetingId = ims.addMeeting(mv);
		
		// 添加会议与参会人关系
		String[] eIdArray = eIdList.split(",");
		if (eIdArray != null) {
			for (int i = 0; i < eIdArray.length; i++) {
				EmployeeMeetingVo emv = new EmployeeMeetingVo();
				emv.setEmployeeId(eIdArray[i]);
				emv.setMeetingId(meetingId);
				iems.addEmployeeMeeting(emv);
			}
		}
		
		// 添加参会人与相关文件的关系
		if (eIdfIdList != null && !"".equals(eIdfIdList)) {
			String[] eIdfIdArray = eIdfIdList.split(";");
			if (eIdfIdArray != null) {
				for(int i = 0; i < eIdfIdArray.length; i++) {
					String[] innerArray = eIdfIdArray[i].split(",");
					FileEmployeeMeetingVo femv = new FileEmployeeMeetingVo();
					femv.setEmployeeId(innerArray[0]);
					femv.setFileId(Long.parseLong(innerArray[1]));
					femv.setMeetingId(meetingId);
					ifems.addFileEmployeeMeeting(femv);
				}
			}
		}
		
		map.put("name", mv.getMeetingTitle());
		return "jsp/success/success";
	}
	
}
