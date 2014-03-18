/**
 * 
 */
package com.wechatoa.web.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wechatoa.web.dao.impl.EmployeeDaoImpl;
import com.wechatoa.web.service.IEmployeeService;
import com.wechatoa.web.vo.EmployeeVo;

/**
 * @author suilei
 * @date 2014年3月18日 下午2:41:59
 */
@Transactional
@Service
public class EmployeeServiceImpl implements IEmployeeService {

	@Autowired
	private EmployeeDaoImpl employeeDaoImpl;
	/* (non-Javadoc)
	 * @see com.wechatoa.web.service.IEmployeeService#addEmployee(com.wechatoa.web.vo.EmployeeVo, int)
	 */
	@Override
	public int addEmployee(EmployeeVo employeeVo) {
		int key = employeeDaoImpl.saveEmployee(employeeVo);
		return key;
	}
	
	@Override
	public EmployeeVo queryEmployeeByEmployeeId(String employeeId) {
		List<EmployeeVo> list = employeeDaoImpl.queryEmployeeByEmployeeId(employeeId);
		if (list != null) {
			return list.get(0);
		}
		return null;
	}

}
