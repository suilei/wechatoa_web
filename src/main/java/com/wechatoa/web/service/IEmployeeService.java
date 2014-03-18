/**
 * 
 */
package com.wechatoa.web.service;

import org.springframework.stereotype.Service;

import com.wechatoa.web.vo.EmployeeVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午2:40:04
 */
@Service
public interface IEmployeeService {
	public int addEmployee(EmployeeVo employeeVo);
	public EmployeeVo queryEmployeeByEmployeeId(String employeeId);
}
