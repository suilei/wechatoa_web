/**
 * 
 */
package com.wechatoa.web.vo;

import java.io.Serializable;

/**
 * @author suilei
 * @date 2014年3月18日 下午2:26:18
 */
public class EmployeeVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int id;
	private String employeeId;
	private String employeeName;
	private int employeeGender;
	private String employeePhone;
	private String employeeEmail;
	private String employeeAvatar;
	private int deptId;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}
	public String getEmployeeName() {
		return employeeName;
	}
	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	public int getEmployeeGender() {
		return employeeGender;
	}
	public void setEmployeeGender(int employeeGender) {
		this.employeeGender = employeeGender;
	}
	public String getEmployeePhone() {
		return employeePhone;
	}
	public void setEmployeePhone(String employeePhone) {
		this.employeePhone = employeePhone;
	}
	public String getEmployeeEmail() {
		return employeeEmail;
	}
	public void setEmployeeEmail(String employeeEmail) {
		this.employeeEmail = employeeEmail;
	}
	public String getEmployeeAvatar() {
		return employeeAvatar;
	}
	public void setEmployeeAvatar(String employeeAvatar) {
		this.employeeAvatar = employeeAvatar;
	}
	public int getDeptId() {
		return deptId;
	}
	public void setDeptId(int deptId) {
		this.deptId = deptId;
	}
	
}
