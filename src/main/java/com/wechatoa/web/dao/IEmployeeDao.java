/**
 * 
 */
package com.wechatoa.web.dao;

import java.util.List;

import com.wechatoa.web.vo.EmployeeVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午2:28:41
 */
public interface IEmployeeDao {
	public int saveEmployee(EmployeeVo employeeVo);
	public List<EmployeeVo> queryEmployeeByEmployeeId(String employeeId);
}
