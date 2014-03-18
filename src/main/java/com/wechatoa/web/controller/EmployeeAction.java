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
import org.springframework.web.bind.annotation.ResponseBody;

import com.wechatoa.web.service.IEmployeeService;
import com.wechatoa.web.vo.EmployeeVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午2:44:41
 */
@Controller
@RequestMapping("/employee")
public class EmployeeAction {
	
	@Autowired
	private IEmployeeService employeeService;
	
	@RequestMapping("/addEmployee")
	public String addEmployee(EmployeeVo employeeVo, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		System.out.println("employeeService:" + employeeService);
		employeeService.addEmployee(employeeVo);
		map.put("name", employeeVo.getEmployeeName());
		return "jsp/success/success";
	}
	
	@RequestMapping("/getMyInfo")
	@ResponseBody
	public EmployeeVo getMyInfo(EmployeeVo employeeVo, ModelMap map,
	        HttpServletRequest request, HttpServletResponse response){
		return employeeService.queryEmployeeByEmployeeId(employeeVo.getEmployeeId());
	}
}
