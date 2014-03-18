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

import com.wechatoa.web.service.IDeptService;
import com.wechatoa.web.vo.DeptVo;

/**
 * @author suilei
 * @date 2014年3月18日 上午10:31:47
 */
@Controller
@RequestMapping("/dept")
public class DeptAction {
	
	@Autowired
	private IDeptService deptService;
	
	@RequestMapping("/saveDept")
	public String saveDept(DeptVo deptVo, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("deptService:" + deptService);
		deptService.saveDept(deptVo);
		map.put("name", deptVo.getDeptName());
		return "jsp/success/success";
	}
	
	@RequestMapping("/queryDeptByName")
	public String queryDeptByName(String deptName, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("deptService:" + deptService);
		DeptVo deptVo = deptService.queryByDeptName(deptName);
		System.out.println("----" + deptVo);
		if (deptVo != null) {
			map.put("name", deptVo.getDeptName());
		}
		return "jsp/success/success";
	}
}
